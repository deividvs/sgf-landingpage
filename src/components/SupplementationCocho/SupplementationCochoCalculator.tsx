import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import {
  SupplementationCochoInputs,
  SupplementationCochoCalculations,
  calculateSupplementationCocho,
  formatNumber
} from '../../lib/supplementation-cocho-calculator';
import { generateSupplementationCochoPDF } from '../../lib/supplementation-cocho-pdf-generator';
import { SupplementationCochoForm } from './SupplementationCochoForm';
import { ArrowLeft, Download, Save, Package, Beef, Scale, BarChart3 } from 'lucide-react';

interface SupplementationCalculation {
  id: string;
  title: string;
  quantity_heads: number;
  supplementation_type: string;
  daily_consumption_kg: number;
  bags_per_day: number;
  created_at: string;
}

export function SupplementationCochoCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form' | 'results'>('list');
  const [savedCalculations, setSavedCalculations] = useState<SupplementationCalculation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<SupplementationCochoInputs | null>(null);
  const [currentCalculations, setCurrentCalculations] = useState<SupplementationCochoCalculations | null>(null);

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('supplementation_calculations')
      .select('id, title, quantity_heads, supplementation_type, daily_consumption_kg, bags_per_day, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedCalculations(data);
    }
    setLoading(false);
  };

  const handleCalculate = (inputs: SupplementationCochoInputs) => {
    const calculations = calculateSupplementationCocho(inputs);
    setCurrentInputs(inputs);
    setCurrentCalculations(calculations);
    setView('results');
  };

  const handleSave = async () => {
    if (!currentInputs || !currentCalculations || !user) return;

    setLoading(true);
    const { error } = await supabase.from('supplementation_calculations').insert({
      user_id: user.id,
      title: currentInputs.title,
      quantity_heads: currentInputs.quantity_heads,
      average_weight_kg: currentInputs.average_weight_kg,
      supplementation_type: currentInputs.supplementation_type,
      consumption_percentage: currentInputs.consumption_percentage,
      bag_weight_kg: currentInputs.bag_weight_kg,
      daily_consumption_kg: currentCalculations.daily_consumption_kg,
      bags_per_day: currentCalculations.bags_per_day
    });

    if (!error) {
      await loadCalculations();
      alert('Calculo salvo com sucesso!');
    } else {
      alert('Erro ao salvar calculo.');
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    if (!currentInputs || !currentCalculations) return;
    generateSupplementationCochoPDF(currentInputs, currentCalculations);
  };

  if (view === 'list') {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Calculo de Suplementacao no Cocho</h1>
            <p className="text-gray-600 mt-2">Determine a quantidade exata de suplemento diario</p>
          </div>
          <button
            onClick={() => setView('form')}
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Novo Calculo
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : savedCalculations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum calculo encontrado</h3>
            <p className="text-gray-600 mb-6">Crie seu primeiro calculo de suplementacao</p>
            <button
              onClick={() => setView('form')}
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Criar Calculo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCalculations.map((calc) => (
              <div
                key={calc.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {calc.title || 'Calculo'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(calc.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Package className="w-6 h-6 text-green-600" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Animais:</span>
                    <span className="font-semibold text-gray-900">{calc.quantity_heads}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tipo:</span>
                    <span className="text-xs font-medium text-gray-900">{calc.supplementation_type}</span>
                  </div>

                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Consumo Diario</p>
                    <p className="text-lg font-bold text-green-700">
                      {formatNumber(calc.daily_consumption_kg, 2)} kg
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Sacos/dia:</span>
                      <span className="font-bold text-lg text-gray-900">
                        {Math.ceil(calc.bags_per_day)}
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

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Calculo</h1>
        <p className="text-gray-600 mb-8">Preencha os dados para calcular a quantidade de suplementacao</p>

        <SupplementationCochoForm onCalculate={handleCalculate} />
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
                <Beef className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Animais</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {currentInputs.quantity_heads}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">Peso Medio</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(currentInputs.average_weight_kg, 0)} kg
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-gray-600">Consumo</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(currentInputs.consumption_percentage, 2)}%
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-teal-600" />
              </div>
              <span className="text-sm text-gray-600">Peso Saco</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatNumber(currentInputs.bag_weight_kg, 0)} kg
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Consumo Diario</h3>
                <p className="text-green-100">Quantidade total necessaria</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <p className="text-5xl font-bold mb-2">
                {formatNumber(currentCalculations.daily_consumption_kg, 2)}
              </p>
              <p className="text-xl text-green-100">quilogramas</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Sacos por Dia</h3>
                <p className="text-blue-100">Quantidade arredondada</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-6">
              <p className="text-5xl font-bold mb-2">
                {currentCalculations.bags_per_day_rounded}
              </p>
              <p className="text-xl text-blue-100">sacos de {formatNumber(currentInputs.bag_weight_kg, 0)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Tipo Selecionado</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xl font-semibold text-gray-900">{currentInputs.supplementation_type}</p>
              <p className="text-sm text-gray-600">Percentual de consumo: {formatNumber(currentInputs.consumption_percentage, 2)}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Comparativo entre Tipos de Suplemento</h3>
          <p className="text-sm text-gray-600 mb-4">
            Veja como seria o consumo com diferentes tipos de suplementacao
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Percentual</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Kg/dia</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Sacos/dia</th>
                </tr>
              </thead>
              <tbody>
                {currentCalculations.comparative_data.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-100 ${
                      item.type === currentInputs.supplementation_type ? 'bg-green-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className={`font-medium ${
                        item.type === currentInputs.supplementation_type ? 'text-green-700' : 'text-gray-900'
                      }`}>
                        {item.type}
                        {item.type === currentInputs.supplementation_type && (
                          <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded">Selecionado</span>
                        )}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-gray-700">
                      {formatNumber(item.percentage, 1)}%
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 font-semibold">
                      {formatNumber(item.daily_kg, 2)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 font-bold">
                      {item.bags}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
