import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  BreakevenInputs,
  BreakevenCalculations,
  calculateBreakeven,
  formatCurrency,
  formatNumber
} from '../../lib/breakeven-calculator';
import { generateBreakevenPDF } from '../../lib/breakeven-pdf-generator';
import { BreakevenForm } from './BreakevenForm';
import { ArrowLeft, Download, Save, TrendingUp, TrendingDown, Scale, DollarSign, Calendar, Weight } from 'lucide-react';

interface BreakevenSimulation {
  id: string;
  title: string;
  breakeven_price: number;
  current_arroba_price: number;
  profit_per_arroba: number;
  final_result: number;
  status: string;
  created_at: string;
}

export function BreakevenCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form' | 'results'>('list');
  const [savedSimulations, setSavedSimulations] = useState<BreakevenSimulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<BreakevenInputs | null>(null);
  const [currentCalculations, setCurrentCalculations] = useState<BreakevenCalculations | null>(null);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('breakeven_simulations')
      .select('id, title, breakeven_price, current_arroba_price, profit_per_arroba, final_result, status, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedSimulations(data);
    }
    setLoading(false);
  };

  const handleCalculate = (inputs: BreakevenInputs) => {
    const calculations = calculateBreakeven(inputs);
    setCurrentInputs(inputs);
    setCurrentCalculations(calculations);
    setView('results');
  };

  const handleSave = async () => {
    if (!currentInputs || !currentCalculations || !user) return;

    setLoading(true);
    const { error } = await supabase.from('breakeven_simulations').insert({
      user_id: user.id,
      title: currentInputs.title,
      acquisition_value: currentInputs.acquisition_value,
      daily_cost: currentInputs.daily_cost,
      days_in_cycle: currentInputs.days_in_cycle,
      final_weight_kg: currentInputs.final_weight_kg,
      current_arroba_price: currentInputs.current_arroba_price,
      total_revenue: currentCalculations.total_revenue,
      total_expenses: currentCalculations.total_expenses,
      total_arrobas: currentCalculations.total_arrobas,
      breakeven_price: currentCalculations.breakeven_price,
      profit_per_arroba: currentCalculations.profit_per_arroba,
      final_result: currentCalculations.final_result,
      status: currentCalculations.status
    });

    if (!error) {
      await loadSimulations();
      alert('Simulacao salva com sucesso!');
    } else {
      alert('Erro ao salvar simulacao.');
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    if (!currentInputs || !currentCalculations) return;
    generateBreakevenPDF(currentInputs, currentCalculations);
  };

  if (view === 'list') {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ponto de Equilibrio da Arroba</h1>
            <p className="text-gray-600 mt-2">Descubra o preco minimo para nao ter prejuizo</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Nova Simulacao
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : savedSimulations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma simulacao encontrada</h3>
            <p className="text-gray-600 mb-6">Crie sua primeira simulacao de ponto de equilibrio</p>
            <button
              onClick={() => setView('form')}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Criar Simulacao
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSimulations.map((sim) => (
              <div
                key={sim.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {sim.title || 'Simulacao'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(sim.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {sim.status === 'profit' ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : sim.status === 'loss' ? (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  ) : (
                    <Scale className="w-6 h-6 text-yellow-600" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Ponto de Equilibrio</p>
                    <p className="text-lg font-bold text-blue-700">
                      {formatCurrency(sim.breakeven_price)}/@
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Preco Mercado:</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(sim.current_arroba_price)}/@
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {sim.profit_per_arroba >= 0 ? 'Lucro/@:' : 'Prejuizo/@:'}
                    </span>
                    <span
                      className={`font-bold ${
                        sim.profit_per_arroba >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(Math.abs(sim.profit_per_arroba))}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Resultado Total:</span>
                      <span
                        className={`font-bold text-lg ${
                          sim.final_result >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(Math.abs(sim.final_result))}
                      </span>
                    </div>
                  </div>
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nova Simulacao</h1>
        <p className="text-gray-600 mb-8">Preencha os dados para calcular o ponto de equilibrio</p>

        <BreakevenForm onCalculate={handleCalculate} />
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
            <h1 className="text-3xl font-bold text-gray-900">Resultados</h1>
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Valor Aquisicao</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(currentInputs.acquisition_value)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-600">Custo Diario</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(currentInputs.daily_cost)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Dias no Ciclo</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {currentInputs.days_in_cycle}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Weight className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-sm text-gray-600">Peso Final</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(currentInputs.final_weight_kg, 2)} kg
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo Financeiro</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Arrobas:</span>
                <span className="font-semibold text-gray-900">
                  {formatNumber(currentCalculations.total_arrobas, 2)} @
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Receita Total:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(currentCalculations.total_revenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total de Despesas:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(currentCalculations.total_expenses)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Comparativo de Precos</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Preco de Mercado:</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(currentInputs.current_arroba_price)}/@
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-600 font-medium">Ponto de Equilibrio:</span>
                <span className="font-bold text-blue-600">
                  {formatCurrency(currentCalculations.breakeven_price)}/@
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className={currentCalculations.profit_per_arroba >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  Diferenca:
                </span>
                <span className={`font-bold ${currentCalculations.profit_per_arroba >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(currentCalculations.profit_per_arroba))}/@
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-8 mb-8 ${
          currentCalculations.status === 'profit'
            ? 'bg-gradient-to-br from-green-600 to-green-700'
            : currentCalculations.status === 'loss'
            ? 'bg-gradient-to-br from-red-600 to-red-700'
            : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
        } text-white`}>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{currentCalculations.interpretation.icon}</div>
            <div>
              <h3 className="text-2xl font-bold">Resultado da Simulacao</h3>
              <p className="text-lg opacity-90">
                {currentCalculations.status === 'profit' ? 'Operacao Lucrativa' :
                 currentCalculations.status === 'loss' ? 'Operacao com Prejuizo' :
                 'Ponto de Equilibrio'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white border-opacity-30">
            <div>
              <p className="text-white text-opacity-80 text-sm mb-2">
                {currentCalculations.final_result >= 0 ? 'Lucro por Animal' : 'Prejuizo por Animal'}
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(Math.abs(currentCalculations.final_result))}
              </p>
            </div>
            <div>
              <p className="text-white text-opacity-80 text-sm mb-2">
                {currentCalculations.profit_per_arroba >= 0 ? 'Lucro por Arroba' : 'Prejuizo por Arroba'}
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(Math.abs(currentCalculations.profit_per_arroba))}/@
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl p-6 border-2 ${
          currentCalculations.interpretation.color === 'green'
            ? 'bg-green-50 border-green-200'
            : currentCalculations.interpretation.color === 'yellow'
            ? 'bg-yellow-50 border-yellow-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Analise</h3>
          <p className="text-gray-700">{currentCalculations.interpretation.message}</p>
        </div>
      </div>
    );
  }

  return null;
}
