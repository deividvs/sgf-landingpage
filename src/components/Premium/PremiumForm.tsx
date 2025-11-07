import { useState } from 'react';
import { PremiumInputs, calculatePremium, PremiumResults } from '../../lib/premium-calculator';
import { Calculator, TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Props = {
  onCalculate: (inputs: PremiumInputs, results: PremiumResults) => void;
};

export function PremiumForm({ onCalculate }: Props) {
  const [formData, setFormData] = useState<PremiumInputs>({
    current_arroba_value: 0,
    animal_paid_value: 0,
    purchase_weight_kg: 0,
    rearing_period_days: 0,
  });

  const [results, setResults] = useState<PremiumResults | null>(null);

  const updateFormData = (field: keyof PremiumInputs, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setResults(null);
  };

  const handleCalculate = () => {
    if (
      formData.current_arroba_value > 0 &&
      formData.animal_paid_value > 0 &&
      formData.purchase_weight_kg > 0 &&
      formData.rearing_period_days > 0
    ) {
      const calculatedResults = calculatePremium(formData);
      setResults(calculatedResults);
      onCalculate(formData, calculatedResults);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const canCalculate =
    formData.current_arroba_value > 0 &&
    formData.animal_paid_value > 0 &&
    formData.purchase_weight_kg > 0 &&
    formData.rearing_period_days > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Diluir Ágio</h2>
            <p className="text-gray-600">Simule o impacto do ágio/deságio na compra de animais</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor da Arroba Atual (R$/@)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.current_arroba_value || ''}
              onChange={(e) => updateFormData('current_arroba_value', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="300.00"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Preço de referência do mercado</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Pago pelo Animal (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.animal_paid_value || ''}
              onChange={(e) => updateFormData('animal_paid_value', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="1850.00"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Preço total pago na compra</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso do Animal na Compra (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.purchase_weight_kg || ''}
              onChange={(e) => updateFormData('purchase_weight_kg', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="180"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Peso no momento da compra</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Período de Recria (dias)
            </label>
            <input
              type="number"
              value={formData.rearing_period_days || ''}
              onChange={(e) => updateFormData('rearing_period_days', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="300"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tempo previsto para venda ({formData.rearing_period_days > 0 ? (formData.rearing_period_days / 30).toFixed(1) : '0'} meses)
            </p>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!canCalculate}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Calcular Ágio/Deságio
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className={`rounded-lg p-6 mb-6 ${
            results.situation === 'premium'
              ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300'
              : results.situation === 'discount'
              ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300'
              : 'bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-300'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {results.situation === 'premium' ? (
                <TrendingUp className="w-10 h-10 text-red-600" />
              ) : results.situation === 'discount' ? (
                <TrendingDown className="w-10 h-10 text-green-600" />
              ) : (
                <Minus className="w-10 h-10 text-gray-600" />
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {results.situation === 'premium'
                    ? 'ÁGIO - Você pagou acima do mercado'
                    : results.situation === 'discount'
                    ? 'DESÁGIO - Você pagou abaixo do mercado'
                    : 'NEUTRO - Você pagou o preço de mercado'}
                </h3>
                <p className="text-gray-600">
                  {results.situation === 'premium'
                    ? 'É necessário ganho de peso adicional para compensar'
                    : results.situation === 'discount'
                    ? 'Compra vantajosa! Menor necessidade de ganho de peso'
                    : 'Compra dentro do preço de mercado'}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Arrobas na Compra</p>
              <p className="text-2xl font-bold text-slate-700">{results.arrobas_at_purchase.toFixed(2)} @</p>
              <p className="text-xs text-gray-500 mt-1">
                {formData.purchase_weight_kg} kg ÷ 30
              </p>
            </div>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Custo por Kg Vivo</p>
              <p className="text-2xl font-bold text-teal-700">{formatCurrency(results.cost_per_kg)}</p>
              <p className="text-xs text-gray-500 mt-1">
                R$ {formData.animal_paid_value.toFixed(2)} ÷ {formData.purchase_weight_kg} kg
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Preço Pago por Arroba</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(results.paid_price_per_arroba)}</p>
              <p className="text-xs text-gray-500 mt-1">
                Referência: {formatCurrency(formData.current_arroba_value)}
              </p>
            </div>

            <div className={`border rounded-lg p-4 ${
              results.situation === 'premium'
                ? 'bg-red-50 border-red-200'
                : results.situation === 'discount'
                ? 'bg-green-50 border-green-200'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <p className="text-sm text-gray-600 mb-1">Ágio/Deságio por Arroba</p>
              <p className={`text-2xl font-bold ${
                results.situation === 'premium'
                  ? 'text-red-700'
                  : results.situation === 'discount'
                  ? 'text-green-700'
                  : 'text-gray-700'
              }`}>
                {formatCurrency(Math.abs(results.premium_discount_per_arroba))}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.abs(results.premium_discount_percentage).toFixed(2)}% {results.situation === 'premium' ? 'acima' : 'abaixo'} do mercado
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total de Ágio/Deságio</p>
              <p className="text-2xl font-bold text-amber-700">
                {formatCurrency(Math.abs(results.total_premium_discount_per_animal))}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.abs(results.premium_discount_per_arroba).toFixed(2)} × {results.arrobas_at_purchase.toFixed(2)} @
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Ágio Diário a Diluir</p>
              <p className="text-2xl font-bold text-purple-700">
                {formatCurrency(results.daily_premium_to_dilute)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                R$ {Math.abs(results.total_premium_discount_per_animal).toFixed(2)} ÷ {formData.rearing_period_days} dias
              </p>
            </div>

            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">GMD Necessário para Diluir</p>
              <p className="text-2xl font-bold text-cyan-700">
                {results.daily_gain_needed_kg.toFixed(3)} kg/dia
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {(results.daily_gain_needed_kg * 1000).toFixed(0)} gramas por dia
              </p>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Período de Recria</p>
              <p className="text-2xl font-bold text-indigo-700">
                {results.months_to_dilute.toFixed(1)} meses
              </p>
              <p className="text-xs text-gray-500 mt-1">{formData.rearing_period_days} dias</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
