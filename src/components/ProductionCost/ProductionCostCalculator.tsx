import { useState } from 'react';
import { ArrowLeft, Download, DollarSign, Calendar, TrendingUp, Target } from 'lucide-react';
import { ProductionCostForm } from './ProductionCostForm';
import {
  calculateProductionCost,
  type ProductionCostInputs,
  type ProductionCostResults,
} from '../../lib/production-cost-calculator';
import { generateProductionCostPDF } from '../../lib/production-cost-pdf-generator';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function ProductionCostCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'form' | 'results'>('form');
  const [inputs, setInputs] = useState<ProductionCostInputs | null>(null);
  const [results, setResults] = useState<ProductionCostResults | null>(null);
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCalculate = (newInputs: ProductionCostInputs) => {
    const newResults = calculateProductionCost(newInputs);
    setInputs(newInputs);
    setResults(newResults);
    setView('results');
  };

  const handleSave = async () => {
    if (!user || !inputs || !results) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from('production_cost_calculations').insert({
        user_id: user.id,
        title: title || 'Cálculo sem título',
        quantity_animals: inputs.quantity_animals,
        lease_monthly: inputs.lease_monthly,
        supplementation_monthly: inputs.supplementation_monthly,
        labor_monthly: inputs.labor_monthly,
        variable_costs_monthly: inputs.variable_costs_monthly,
        gmd_kg: inputs.gmd_kg,
        carcass_yield_percentage: inputs.carcass_yield_percentage,
        total_monthly_expense: results.total_monthly_expense,
        monthly_expense_per_animal: results.monthly_expense_per_animal,
        daily_cost_per_animal: results.daily_cost_per_animal,
        days_per_arroba: results.days_per_arroba,
        cost_per_arroba: results.cost_per_arroba,
        classification: results.classification,
      });

      if (!error) {
        alert('Cálculo salvo com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar o cálculo.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (inputs && results) {
      generateProductionCostPDF(inputs, results, title || 'Cálculo de Custo de Produção');
    }
  };

  const handleNewCalculation = () => {
    setView('form');
    setInputs(null);
    setResults(null);
    setTitle('');
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'excelente':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'alto_custo':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getClassificationText = (classification: string) => {
    switch (classification) {
      case 'excelente':
        return 'Excelente Eficiência';
      case 'media':
        return 'Dentro da Média';
      case 'alto_custo':
        return 'Alto Custo - Precisa Revisar';
      default:
        return '';
    }
  };

  if (view === 'results' && results && inputs) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleNewCalculation}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Novo Cálculo
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              Exportar PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Resultados do Cálculo</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Cálculo (opcional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Lote Fazenda Santa Rita - Outubro 2024"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div
            className={`mb-6 p-4 rounded-lg border-2 ${getClassificationColor(
              results.classification
            )}`}
          >
            <p className="text-lg font-semibold text-center">
              {getClassificationText(results.classification)}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-red-50 rounded-lg p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-red-600" />
                <h3 className="font-semibold text-gray-700">Despesa Mensal Total</h3>
              </div>
              <p className="text-3xl font-bold text-red-600">
                R$ {results.total_monthly_expense.toFixed(2)}
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-orange-600" />
                <h3 className="font-semibold text-gray-700">Despesa por Animal</h3>
              </div>
              <p className="text-3xl font-bold text-orange-600">
                R$ {results.monthly_expense_per_animal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">por mês</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="w-6 h-6 text-yellow-600" />
                <h3 className="font-semibold text-gray-700">Custo Diário</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-600">
                R$ {results.daily_cost_per_animal.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">por animal/dia</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h3 className="font-semibold text-gray-700">Dias por Arroba</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {results.days_per_arroba.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-1">dias para produzir 1@ de carcaça (15kg)</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200 md:col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-purple-600" />
                <h3 className="font-semibold text-gray-700">Custo por Arroba Produzida</h3>
              </div>
              <p className="text-4xl font-bold text-purple-600">
                R$ {results.cost_per_arroba.toFixed(2)}/@
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Interpretação</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">•</span>
                <span>Custo &lt; R$ 270/@ = Excelente eficiência</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 font-bold">•</span>
                <span>Custo entre R$ 270 e R$ 320/@ = Dentro da média</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Custo &gt; R$ 320/@ = Alto custo, necessita revisão</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full mt-6 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar Cálculo'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Cálculo de Custo de Produção PRO</h2>
        <p className="text-gray-600">
          Descubra quanto custa produzir uma arroba com base nos seus custos mensais e GMD do
          rebanho.
        </p>
      </div>

      <ProductionCostForm onCalculate={handleCalculate} />
    </div>
  );
}
