import { useState } from 'react';
import {
  DailyCostInputs,
  DailyCostResults,
  MonthlyCosts,
  calculateDailyCost,
  COST_CATEGORIES,
} from '../../lib/daily-cost-calculator';
import { Calculator, DollarSign, Save, Download, TrendingUp, TrendingDown } from 'lucide-react';

type Props = {
  onCalculate: (inputs: DailyCostInputs, results: DailyCostResults) => void;
  onSave: (inputs: DailyCostInputs, results: DailyCostResults) => Promise<void>;
  onExportPDF: (inputs: DailyCostInputs, results: DailyCostResults) => void;
};

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function DailyCostForm({ onCalculate, onSave, onExportPDF }: Props) {
  const currentYear = new Date().getFullYear();
  const currentMonth = MONTHS[new Date().getMonth()];

  const [formData, setFormData] = useState<DailyCostInputs>({
    month: currentMonth,
    year: currentYear,
    costs: {
      supplementation: 0,
      employees: 0,
      feed: 0,
      iatf_veterinary: 0,
      fuel: 0,
      vehicles: 0,
      materials: 0,
      taxes: 0,
      other_expenses: 0,
    },
    total_animals: 0,
    supplement_cost_per_kg: 0,
    supplement_quantity_per_animal_day: 0,
    average_daily_gain_kg: 0,
    market_arroba_price: 0,
  });

  const [results, setResults] = useState<DailyCostResults | null>(null);
  const [saving, setSaving] = useState(false);

  const updateCost = (field: keyof MonthlyCosts, value: number) => {
    setFormData((prev) => ({
      ...prev,
      costs: { ...prev.costs, [field]: value },
    }));
    setResults(null);
  };

  const updateFormData = (field: keyof Omit<DailyCostInputs, 'costs'>, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setResults(null);
  };

  const handleCalculate = () => {
    const hasValidCosts = Object.values(formData.costs).some(v => v > 0);
    const hasValidAnimals = formData.total_animals > 0;
    const hasValidGMD = formData.average_daily_gain_kg > 0;
    const hasValidPrice = formData.market_arroba_price > 0;

    if (hasValidCosts && hasValidAnimals && hasValidGMD && hasValidPrice) {
      const calculatedResults = calculateDailyCost(formData);
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

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const totalMonthlyCost = Object.values(formData.costs).reduce((sum, value) => sum + value, 0);

  const canCalculate =
    totalMonthlyCost > 0 &&
    formData.total_animals > 0 &&
    formData.average_daily_gain_kg > 0 &&
    formData.market_arroba_price > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cálculo da Diária Pecuária</h2>
            <p className="text-gray-600">Calcule os custos operacionais e a margem por arroba</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mês</label>
            <select
              value={formData.month}
              onChange={(e) => updateFormData('month', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              {MONTHS.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => updateFormData('year', parseInt(e.target.value) || currentYear)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              min="2000"
              max="2100"
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Custos Mensais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(COST_CATEGORIES) as Array<keyof MonthlyCosts>).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {COST_CATEGORIES[key]} (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.costs[key] || ''}
                  onChange={(e) => updateCost(key, parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="0,00"
                  min="0"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700">
              Custo Total Mensal: <span className="text-xl font-bold text-emerald-700">{formatCurrency(totalMonthlyCost)}</span>
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informações do Rebanho</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total de Cabeças Médias
              </label>
              <input
                type="number"
                value={formData.total_animals || ''}
                onChange={(e) => updateFormData('total_animals', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="500"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custo do Suplemento (R$/kg)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.supplement_cost_per_kg || ''}
                onChange={(e) => updateFormData('supplement_cost_per_kg', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="8,00"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qtd Suplemento (kg/cab/dia)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.supplement_quantity_per_animal_day || ''}
                onChange={(e) => updateFormData('supplement_quantity_per_animal_day', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0,50"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GMD - Ganho Médio Diário (kg)
              </label>
              <input
                type="number"
                step="0.001"
                value={formData.average_daily_gain_kg || ''}
                onChange={(e) => updateFormData('average_daily_gain_kg', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="0,300"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço da Arroba no Mercado (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.market_arroba_price || ''}
                onChange={(e) => updateFormData('market_arroba_price', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="300,00"
                min="0"
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!canCalculate}
          className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          Calcular Diária
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Resultados do Cálculo</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Custo Diário por Animal</p>
              <p className="text-2xl font-bold text-blue-700">{formatCurrency(results.total_daily_cost)}</p>
              <p className="text-xs text-gray-500 mt-1">por cabeça/dia</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Dias para Produzir 1@</p>
              <p className="text-2xl font-bold text-purple-700">{formatNumber(results.days_to_produce_arroba, 0)} dias</p>
              <p className="text-xs text-gray-500 mt-1">30kg ÷ {formatNumber(formData.average_daily_gain_kg, 3)} kg/dia</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600 mb-1">Custo por Arroba Produzida</p>
              <p className="text-2xl font-bold text-amber-700">{formatCurrency(results.cost_per_arroba)}</p>
              <p className="text-xs text-gray-500 mt-1">custo de produção</p>
            </div>

            <div
              className={`bg-gradient-to-br ${
                results.is_profitable ? 'from-green-50 to-emerald-50 border-green-300' : 'from-red-50 to-rose-50 border-red-300'
              } border-2 rounded-lg p-4`}
            >
              <div className="flex items-center gap-2 mb-1">
                {results.is_profitable ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
                <p className="text-sm font-medium text-gray-600">Resultado por Arroba</p>
              </div>
              <p className={`text-2xl font-bold ${results.is_profitable ? 'text-green-700' : 'text-red-700'}`}>
                {results.is_profitable ? '+' : ''}{formatCurrency(results.profit_per_arroba)}
              </p>
              <p className="text-xs text-gray-500 mt-1">{results.is_profitable ? 'lucro' : 'prejuízo'}</p>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Detalhamento dos Custos Diários</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="text-sm text-gray-600">Suplementação Diária</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(results.daily_supplement_cost)}</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="text-sm text-gray-600">Mão de Obra Diária</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(results.daily_employee_cost)}</p>
              </div>
              <div className="border-l-4 border-amber-500 pl-4">
                <p className="text-sm text-gray-600">Outras Despesas Diárias</p>
                <p className="text-xl font-bold text-gray-800">{formatCurrency(results.daily_other_costs)}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Composição dos Custos Mensais</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Categoria</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border">Valor (R$)</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border">% do Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.cost_breakdown_percentage
                    .filter(item => item.value > 0)
                    .sort((a, b) => b.value - a.value)
                    .map((item, index) => (
                      <tr key={item.category} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-sm text-gray-800 border">{item.category}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-800 border">{formatCurrency(item.value)}</td>
                        <td className="px-4 py-2 text-sm text-right text-gray-800 border">{formatNumber(item.percentage, 1)}%</td>
                      </tr>
                    ))}
                  <tr className="bg-emerald-100 font-semibold">
                    <td className="px-4 py-3 text-sm text-gray-800 border">TOTAL</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-800 border">{formatCurrency(results.total_monthly_cost)}</td>
                    <td className="px-4 py-3 text-sm text-right text-gray-800 border">100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={async () => {
                setSaving(true);
                await onSave(formData, results);
                setSaving(false);
              }}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Salvando...' : 'Salvar Simulação'}
            </button>
            <button
              onClick={() => onExportPDF(formData, results)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <Download className="w-5 h-5" />
              Exportar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
