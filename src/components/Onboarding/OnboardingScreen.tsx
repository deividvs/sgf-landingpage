import { Calculator, TrendingUp, DollarSign, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full p-8 md:p-12 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Calculator className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Bem-vindo ao Sistema de Simulações Pecuárias
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Otimize seus resultados na pecuária com ferramentas profissionais de cálculo e análise
          </p>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            onClick={onComplete}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Começar Cadastro
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Análise de Resultados</h3>
              <p className="text-sm text-gray-600">Calcule resultados anuais e projeções financeiras detalhadas</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Controle de Custos</h3>
              <p className="text-sm text-gray-600">Monitore custos diários, de produção e ponto de equilíbrio</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Simulações Avançadas</h3>
              <p className="text-sm text-gray-600">Taxa de lotação, suplementação e cálculo de prêmios</p>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Análise de Compra e Venda</h3>
              <p className="text-sm text-gray-600">Simule compras de gado e rendimento de carcaça</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 space-y-4 border-2 border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            Como Começar
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  1
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Use o mesmo email da sua compra</h3>
                <p className="text-sm text-gray-600">Certifique-se de usar o email cadastrado na sua compra para ativar sua assinatura automaticamente</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  2
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Crie uma senha segura</h3>
                <p className="text-sm text-gray-600">Escolha uma senha forte com pelo menos 8 caracteres</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  3
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Comece a usar suas ferramentas</h3>
                <p className="text-sm text-gray-600">Acesse todas as calculadoras e simulações disponíveis</p>
              </div>
            </div>
          </div>
        </div>

        <Alert className="bg-amber-50 border-amber-300">
          <AlertCircle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-900 font-medium">
            <span className="font-bold">IMPORTANTE:</span> Anote sua senha em um local seguro para não esquecer. Você precisará dela para acessar o sistema.
          </AlertDescription>
        </Alert>
      </Card>
    </div>
  );
}
