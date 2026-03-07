/*
  # Restaurar Schema Original do Bolt
  
  ## Descrição
  Esta migração remove todas as tabelas customizadas e restaura o banco de dados
  para o estado original do Bolt, mantendo apenas a tabela 'simulations'.
  
  ## Ações
  
  ### Tabelas Removidas
  - `user_tool_favorites` - Sistema de favoritos de ferramentas
  - `premium_simulations` - Cálculos de prêmio
  - `breakeven_simulations` - Cálculos de ponto de equilíbrio
  - `annual_results` - Resultados anuais
  - `supplementation_calculations` - Cálculos de suplementação
  - `daily_cost_simulations` - Custos diários
  - `hotmart_purchases` - Integração Hotmart
  - `carcass_yield_calculations` - Cálculos de rendimento de carcaça
  - `stocking_rate_simulations` - Taxa de lotação
  - `purchase_simulations` - Simulações de compra
  - `user_subscriptions` - Sistema de assinaturas
  
  ### Funções Removidas
  - `create_test_subscription` - Função de teste de assinatura
  
  ### Tabela Mantida
  - `simulations` - Tabela original do Bolt (sem alterações)
  
  ## Segurança
  - Todas as políticas RLS das tabelas removidas serão excluídas automaticamente
  - A tabela simulations mantém suas políticas RLS originais intactas
  
  ## Nota Importante
  Esta migração remove permanentemente todas as tabelas customizadas e seus dados.
*/

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS user_tool_favorites CASCADE;
DROP TABLE IF EXISTS premium_simulations CASCADE;
DROP TABLE IF EXISTS breakeven_simulations CASCADE;
DROP TABLE IF EXISTS annual_results CASCADE;
DROP TABLE IF EXISTS supplementation_calculations CASCADE;
DROP TABLE IF EXISTS daily_cost_simulations CASCADE;
DROP TABLE IF EXISTS hotmart_purchases CASCADE;
DROP TABLE IF EXISTS carcass_yield_calculations CASCADE;
DROP TABLE IF EXISTS stocking_rate_simulations CASCADE;
DROP TABLE IF EXISTS purchase_simulations CASCADE;
DROP TABLE IF EXISTS user_subscriptions CASCADE;

-- Drop custom functions
DROP FUNCTION IF EXISTS create_test_subscription(uuid) CASCADE;

-- Verify simulations table still exists and is properly configured
DO $$
BEGIN
  -- Ensure the simulations table has RLS enabled
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'simulations' AND schemaname = 'public') THEN
    ALTER TABLE simulations ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
