import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  AnnualResultsInputs,
  AnnualResultsCalculations,
  calculateAnnualResults,
  formatCurrency,
  formatNumber
} from '../../lib/annual-results-calculator';
import { generateAnnualResultsPDF } from '../../lib/annual-results-pdf-generator';
import { AnnualResultsForm } from './AnnualResultsForm';
import { ArrowLeft, Download, Save, TrendingUp, TrendingDown, DollarSign, Users, BarChart3 } from 'lucide-react';

interface AnnualResult {
  id: string;
  year: number;
  title: string;
  total_heads: number;
  final_average_weight_kg: number;
  carcass_yield_percentage: number;
  arroba_price: number;
  total_revenue: number;
  profit_margin_percentage: number;
  final_result: number;
  created_at: string;
}

export function AnnualResultsCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form' | 'results'>('list');
  const [savedResults, setSavedResults] = useState<AnnualResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<AnnualResultsInputs | null>(null);
  const [currentCalculations, setCurrentCalculations] = useState<AnnualResultsCalculations | null>(null);

  useEffect(() => {
    loadSavedResults();
  }, []);

  const loadSavedResults = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('annual_results')
      .select('id, year, title, total_heads, final_average_weight_kg, carcass_yield_percentage, arroba_price, total_revenue, profit_margin_percentage, final_result, created_at')
      .order('year', { ascending: false });

    if (!error && data) {
      setSavedResults(data);
    }
    setLoading(false);
  };

  const handleCalculate = (inputs: AnnualResultsInputs) => {
    const calculations = calculateAnnualResults(inputs);
    setCurrentInputs(inputs);
    setCurrentCalculations(calculations);
    setView('results');
  };

  const handleSave = async () => {
    if (!currentInputs || !currentCalculations || !user) return;

    setLoading(true);
    const { error } = await supabase.from('annual_results').insert({
      user_id: user.id,
      year: currentInputs.year,
      title: currentInputs.title,
      total_heads: currentInputs.total_heads,
      final_average_weight_kg: currentInputs.final_average_weight_kg,
      carcass_yield_percentage: currentInputs.carcass_yield_percentage,
      arroba_price: currentInputs.arroba_price,
      carcass_weight_kg: currentCalculations.carcass_weight_kg,
      arrobas_per_head: currentCalculations.arrobas_per_head,
      total_arrobas: currentCalculations.total_arrobas,
      total_revenue: currentCalculations.total_revenue,
      cattle_purchase_cost: currentInputs.cattle_purchase_cost,
      freight_cost: currentInputs.freight_cost,
      commission_cost: currentInputs.commission_cost,
      personnel_cost: currentInputs.personnel_cost,
      pasture_lease_cost: currentInputs.pasture_lease_cost,
      feed_supplement_medicine_cost: currentInputs.feed_supplement_medicine_cost,
      taxes_fees_cost: currentInputs.taxes_fees_cost,
      infrastructure_maintenance_cost: currentInputs.infrastructure_maintenance_cost,
      other_expenses_cost: currentInputs.other_expenses_cost,
      total_cost: currentCalculations.total_cost,
      total_operational_expenses: currentCalculations.total_operational_expenses,
      revenue_per_head: currentCalculations.revenue_per_head,
      cost_per_head: currentCalculations.cost_per_head,
      expense_per_head: currentCalculations.expense_per_head,
      profit_per_head: currentCalculations.profit_per_head,
      profit_margin_percentage: currentCalculations.profit_margin_percentage,
      final_result: currentCalculations.final_result,
      cost_percentage: currentCalculations.cost_percentage,
      expense_percentage: currentCalculations.expense_percentage,
      profit_percentage: currentCalculations.profit_percentage
    });

    if (!error) {
      await loadSavedResults();
      alert('Apuração salva com sucesso!');
    } else {
      alert('Erro ao salvar apuracao.');
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    if (!currentInputs || !currentCalculations) return;
    generateAnnualResultsPDF(currentInputs, currentCalculations);
  };

  if (view === 'list') {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Apuração de Resultados Anuais</h1>
          <button
            onClick={() => setView('form')}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Nova Apuração
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : savedResults.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma apuracao encontrada</h3>
            <p className="text-gray-600 mb-6">Comece criando sua primeira apuracao anual</p>
            <button
              onClick={() => setView('form')}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Criar Apuração
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResults.map((result) => (
              <div
                key={result.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{result.year}</h3>
                    {result.title && <p className="text-sm text-gray-600">{result.title}</p>}
                  </div>
                  {result.final_result >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cabecas:</span>
                    <span className="font-semibold text-gray-900">
                      {result.total_heads.toLocaleString('pt-BR')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Receita:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(result.total_revenue)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Margem:</span>
                    <span
                      className={`font-bold ${
                        result.profit_margin_percentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatNumber(result.profit_margin_percentage, 2)}%
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Resultado:</span>
                      <span
                        className={`font-bold text-lg ${
                          result.final_result >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(result.final_result)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  {new Date(result.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (view === 'form') {
    return (
      <div>
        <button
          onClick={() => setView('list')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Nova Apuração Anual</h1>

        <AnnualResultsForm onCalculate={handleCalculate} />
      </div>
    );
  }

  if (view === 'results' && currentInputs && currentCalculations) {
    return (
      <div>
        <button
          onClick={() => setView('form')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resultados - {currentInputs.year}</h1>
            {currentInputs.title && <p className="text-gray-600 mt-1">{currentInputs.title}</p>}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <Download className="w-5 h-5" />
              Baixar PDF
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              Salvar
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Cálculo de Receita</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-2">Peso Final Medio</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(currentInputs.final_average_weight_kg, 1)} kg</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Rendimento de Carcaca</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(currentInputs.carcass_yield_percentage, 1)}%</p>
              <p className="text-sm text-gray-500 mt-1">{formatNumber(currentCalculations.carcass_weight_kg, 1)} kg de carcaca</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Arrobas por Cabeca</p>
              <p className="text-2xl font-bold text-gray-900">{formatNumber(currentCalculations.arrobas_per_head, 2)} @</p>
              <p className="text-sm text-gray-500 mt-1">{formatNumber(currentCalculations.total_arrobas, 1)} @ total</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Preco da Arroba</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentInputs.arroba_price)}</p>
              <p className="text-sm text-green-600 mt-1 font-semibold">= {formatCurrency(currentCalculations.total_revenue)}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Receita Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(currentCalculations.total_revenue)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-600">Total de Cabecas</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {currentInputs.total_heads.toLocaleString('pt-BR')}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Receita por Cabeca</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(currentCalculations.revenue_per_head)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Custos de Aquisicao</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Compra de Gado:</span>
                <span className="font-semibold">{formatCurrency(currentInputs.cattle_purchase_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fretes:</span>
                <span className="font-semibold">{formatCurrency(currentInputs.freight_cost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Comissoes:</span>
                <span className="font-semibold">{formatCurrency(currentInputs.commission_cost)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(currentCalculations.total_cost)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Despesas Operacionais</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pessoal:</span>
                <span className="font-semibold">{formatCurrency(currentInputs.personnel_cost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Aluguel:</span>
                <span className="font-semibold">{formatCurrency(currentInputs.pasture_lease_cost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Insumos:</span>
                <span className="font-semibold">
                  {formatCurrency(currentInputs.feed_supplement_medicine_cost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxas:</span>
                <span className="font-semibold">{formatCurrency(currentInputs.taxes_fees_cost)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Manutencao:</span>
                <span className="font-semibold">
                  {formatCurrency(currentInputs.infrastructure_maintenance_cost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Outras:</span>
                <span className="font-semibold">{formatCurrency(currentInputs.other_expenses_cost)}</span>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-between">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-gray-900">
                  {formatCurrency(currentCalculations.total_operational_expenses)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Indicadores por Cabeca</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm mb-2">Receita Média</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentCalculations.revenue_per_head)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Custo por Cabeca</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentCalculations.cost_per_head)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Despesa por Cabeca</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentCalculations.expense_per_head)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Lucro por Cabeca</p>
              <p className={`text-2xl font-bold ${currentCalculations.profit_per_head >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(currentCalculations.profit_per_head)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-8 mb-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Resultado Final</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">Margem de Lucro Global</p>
              <p
                className={`text-3xl font-bold ${
                  currentCalculations.profit_margin_percentage >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatNumber(currentCalculations.profit_margin_percentage, 2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">
                {currentCalculations.final_result >= 0 ? 'Lucro Total' : 'Prejuizo Total'}
              </p>
              <p
                className={`text-3xl font-bold ${
                  currentCalculations.final_result >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {formatCurrency(Math.abs(currentCalculations.final_result))}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <h4 className="text-lg font-bold mb-4">Distribuicao sobre a Receita Total</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-2">Receitas</p>
                <p className="text-xl font-bold text-blue-400 mb-1">
                  {formatCurrency(currentCalculations.revenue_per_head)}
                </p>
                <p className="text-sm text-gray-400">100,00%</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Custos</p>
                <p className="text-xl font-bold text-orange-400 mb-1">
                  {formatCurrency(currentCalculations.cost_per_head)}
                </p>
                <p className="text-sm text-orange-400">
                  {formatNumber(currentCalculations.cost_percentage, 2)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Despesas</p>
                <p className="text-xl font-bold text-red-400 mb-1">
                  {formatCurrency(currentCalculations.expense_per_head)}
                </p>
                <p className="text-sm text-red-400">
                  {formatNumber(currentCalculations.expense_percentage, 2)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-2">Lucro</p>
                <p className={`text-xl font-bold mb-1 ${currentCalculations.profit_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(currentCalculations.profit_per_head)}
                </p>
                <p className={`text-sm ${currentCalculations.profit_percentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatNumber(currentCalculations.profit_percentage, 2)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl p-6 border-2 ${
            currentCalculations.interpretation.color === 'green'
              ? 'bg-green-50 border-green-200'
              : currentCalculations.interpretation.color === 'yellow'
              ? 'bg-yellow-50 border-yellow-200'
              : currentCalculations.interpretation.color === 'orange'
              ? 'bg-orange-50 border-orange-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <h3 className="text-lg font-bold text-gray-900 mb-2">Analise</h3>
          <p className="text-gray-700">{currentCalculations.interpretation.message}</p>
        </div>
      </div>
    );
  }

  return null;
}
