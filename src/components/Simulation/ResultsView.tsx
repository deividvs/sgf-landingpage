import { useState } from 'react';
import { SimulationInputs, SimulationResults } from '../../lib/calculations';
import { Download, RefreshCw, Save, TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Calendar, Percent } from 'lucide-react';
import { CostBreakdownChart } from './charts/CostBreakdownChart';
import { RevenueExpenseChart } from './charts/RevenueExpenseChart';
import { generatePDF } from '../../lib/pdf-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Resultados da Simulação</CardTitle>
              <CardDescription className="mt-1">{inputs.herd_description} - {inputs.quantity} animais</CardDescription>
            </div>
            <div className="flex gap-3">
              {showSaveButton && (
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              )}
              <Button
                variant="secondary"
                onClick={handleExportPDF}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar PDF
              </Button>
              <Button
                onClick={onNewSimulation}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Nova Simulação
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={isProfit ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  {isProfit ? (
                    <TrendingUp className="w-8 h-8 text-primary" />
                  ) : (
                    <TrendingDown className="w-8 h-8 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Resultado Total</p>
                    <p className={`text-2xl font-bold ${isProfit ? 'text-primary' : 'text-destructive'}`}>
                      {formatCurrency(results.result_per_animal * inputs.quantity)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Percent className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Margem de Lucro</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatNumber(results.profit_margin_percentage)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <PieChartIcon className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Resultado/Animal</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {formatCurrency(results.result_per_animal)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8" />
                  <div>
                    <p className="text-sm text-muted-foreground">Período</p>
                    <p className="text-2xl font-bold">
                      {formatNumber(results.months_to_sell)} meses
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CostBreakdownChart results={results} />
          <RevenueExpenseChart results={results} />
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
