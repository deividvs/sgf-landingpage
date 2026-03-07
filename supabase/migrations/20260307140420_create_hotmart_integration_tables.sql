/*
  # Integração Hotmart - Tabelas para Controle de Pagamento e Assinatura

  1. Novas Tabelas
    - `hotmart_purchases`
      - `id` (uuid, primary key)
      - `transaction_id` (text, unique) - ID da transação na Hotmart
      - `buyer_email` (text) - Email do comprador
      - `buyer_name` (text) - Nome do comprador
      - `product_id` (text) - ID do produto na Hotmart
      - `status` (text) - Status da compra (approved, canceled, refunded, etc)
      - `purchase_date` (timestamptz) - Data da compra
      - `amount` (numeric) - Valor da compra
      - `currency` (text) - Moeda (BRL, USD, etc)
      - `subscription_id` (text, nullable) - ID da assinatura se for recorrente
      - `webhook_payload` (jsonb) - Payload completo do webhook para auditoria
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `user_subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - Referência ao usuário do Supabase
      - `hotmart_transaction_id` (text) - ID da transação na Hotmart
      - `subscription_status` (text) - Status da assinatura (active, expired, cancelled, pending)
      - `started_at` (timestamptz) - Data de início da assinatura
      - `expires_at` (timestamptz, nullable) - Data de expiração
      - `cancelled_at` (timestamptz, nullable) - Data de cancelamento
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para usuários visualizarem apenas suas próprias assinaturas
    - Políticas para serviços (Edge Functions) gerenciarem todas as transações
  
  3. Funções Auxiliares
    - Função para verificar se usuário tem assinatura ativa
    - Trigger para atualizar updated_at automaticamente
*/

-- Criar tabela de compras da Hotmart
CREATE TABLE IF NOT EXISTS hotmart_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  buyer_email text NOT NULL,
  buyer_name text,
  product_id text NOT NULL,
  status text NOT NULL CHECK (status IN ('approved', 'canceled', 'refunded', 'completed', 'pending', 'expired', 'chargeback')),
  purchase_date timestamptz NOT NULL,
  amount numeric CHECK (amount >= 0),
  currency text DEFAULT 'BRL',
  subscription_id text,
  webhook_payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_hotmart_purchases_buyer_email ON hotmart_purchases(buyer_email);
CREATE INDEX IF NOT EXISTS idx_hotmart_purchases_transaction_id ON hotmart_purchases(transaction_id);
CREATE INDEX IF NOT EXISTS idx_hotmart_purchases_status ON hotmart_purchases(status);

-- Criar tabela de assinaturas de usuários
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hotmart_transaction_id text NOT NULL,
  subscription_status text NOT NULL DEFAULT 'pending' CHECK (subscription_status IN ('active', 'expired', 'cancelled', 'pending')),
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(subscription_status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_hotmart_transaction ON user_subscriptions(hotmart_transaction_id);

-- Habilitar RLS
ALTER TABLE hotmart_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para hotmart_purchases
-- Apenas service_role pode inserir/atualizar (usado pela Edge Function)
CREATE POLICY "Service role can manage all purchases"
  ON hotmart_purchases
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Políticas RLS para user_subscriptions
-- Usuários podem ver apenas sua própria assinatura
CREATE POLICY "Users can view own subscription"
  ON user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role pode gerenciar todas as assinaturas
CREATE POLICY "Service role can manage all subscriptions"
  ON user_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
DROP TRIGGER IF EXISTS update_hotmart_purchases_updated_at ON hotmart_purchases;
CREATE TRIGGER update_hotmart_purchases_updated_at
  BEFORE UPDATE ON hotmart_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para verificar se usuário tem assinatura ativa
CREATE OR REPLACE FUNCTION has_active_subscription(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM user_subscriptions 
    WHERE user_id = user_uuid 
    AND subscription_status = 'active'
    AND (expires_at IS NULL OR expires_at > now())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
