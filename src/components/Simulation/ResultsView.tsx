import { useState } from 'react';
import { SimulationInputs, SimulationResults } from '../../lib/calculations';
import { Download, RefreshCw, Save, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Calendar, Percent } from 'lucide-react';
import { CostBreakdownChart } from './charts/CostBreakdownChart';
import { RevenueExpenseChart } from './charts/RevenueExpenseChart';
import { generatePDF } from '../../lib/pdf-generator';

type Props = {
  inputs: SimulationInputs;
  results: SimulationResults;
  onNewSimulation: () => void;
  onSave: () => Promise<void>;
  showSaveButton?: boolean;
};

export function ResultsView({ inputs, results, onNewSimulation, onSave, showSaveButton = true }: Props) {
  const [saving, setSaving] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave();
    setSaving(false);
  };

  const handleExportPDF = () => {
    generatePDF(inputs, results);
  };

  const isProfit = results.result_per_animal > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Resultados da Simulação</h2>
            <p className="text-gray-600 mt-1">{inputs.herd_description} - {inputs.quantity} animais</p>
          </div>
          <div className="flex gap-3">
            {showSaveButton && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            )}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-5 h-5" />
              Exportar PDF
            </button>
            <button
              onClick={onNewSimulation}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <RefreshCw className="w-5 h-5" />
              Nova Simulação
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`p-6 rounded-lg ${isProfit ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-3 mb-2">
              {isProfit ? (
                <TrendingUp className="w-8 h-8 text-green-600" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-600" />
              )}
              <div>
                <p className="text-sm text-gray-600">Resultado Total</p>
                <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.result_per_animal * inputs.quantity)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <Percent className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Margem de Lucro</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatNumber(results.profit_margin_percentage)}%
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-3 mb-2">
              <PieChartIcon className="w-8 h-8 text-amber-600" />
              <div>
                <p className="text-sm text-gray-600">Resultado/Animal</p>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(results.result_per_animal)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-lg bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Período</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(results.months_to_sell)} meses
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-bold text-gray-800">Receita</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Venda Total</span>
                <span className="text-2xl font-bold text-green-700">{formatCurrency(results.total_revenue)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                <p>Valor da Arroba: {formatCurrency(inputs.arroba_value)}</p>
                <p>Peso Final por Animal: {formatNumber(inputs.final_weight)} kg</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Informações Adicionais</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Peso a Ganhar</span>
                <span className="font-semibold">{formatNumber(results.weight_to_gain)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Custo por Arroba</span>
                <span className="font-semibold">{formatCurrency(results.cost_per_arroba)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GMD</span>
                <span className="font-semibold">{formatNumber(inputs.average_daily_gain, 3)} kg/dia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-red-600 text-white px-3 py-1 rounded">CUSTOS TOTAIS</span>
            <span className="text-gray-600 text-sm">(Período Total: {formatNumber(results.months_to_sell)} meses)</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Custo de Reposição</span>
                <span className="text-lg font-bold">{formatCurrency(results.acquisition_costs)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Arrendamento</span>
                <span className="text-lg font-bold">{formatCurrency(results.lease_costs)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Mão de Obra</span>
                <span className="text-lg font-bold">{formatCurrency(results.labor_costs)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Suplementação</span>
                <span className="text-lg font-bold">{formatCurrency(results.supplement_costs)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Outras Despesas</span>
                <span className="text-lg font-bold">{formatCurrency(results.other_costs)}</span>
              </div>
              <div className="flex justify-between items-center border-t-2 border-red-300 pt-3 mt-3">
                <span className="text-gray-900 font-bold text-lg">TOTAL</span>
                <span className="text-2xl font-bold text-red-700">{formatCurrency(results.total_expenses)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-blue-600 text-white px-3 py-1 rounded">CUSTOS MENSAIS POR CABEÇA</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Arrendamento</span>
                <span className="text-lg font-bold">{formatCurrency(results.monthly_lease_cost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Mão de Obra</span>
                <span className="text-lg font-bold">{formatCurrency(results.monthly_labor_cost)}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Suplementação</span>
                <span className="text-lg font-bold">{formatCurrency(results.monthly_supplement_cost)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Outras Despesas</span>
                <span className="text-lg font-bold">{formatCurrency(results.monthly_other_cost)}</span>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow-md border-2 border-blue-300">
                <span className="text-gray-900 font-bold text-lg">TOTAL MENSAL</span>
                <span className="text-2xl font-bold text-blue-700">{formatCurrency(results.monthly_cost_total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CostBreakdownChart results={results} />
        <RevenueExpenseChart results={results} />
      </div>
    </div>
  );
}
