import { useState } from 'react';
import {
  StockingRateInputs,
  StockingRateResults,
  calculateStockingRate,
  CLASSIFICATIONS,
} from '../../lib/stocking-rate-calculator';
import { MapPin, Users, Weight, Calculator, Save, Download, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

type Props = {
  onCalculate: (inputs: StockingRateInputs, results: StockingRateResults) => void;
  onSave: (inputs: StockingRateInputs, results: StockingRateResults) => Promise<void>;
  onExportPDF: (inputs: StockingRateInputs, results: StockingRateResults) => void;
};

export function StockingRateForm({ onCalculate, onSave, onExportPDF }: Props) {
  const [formData, setFormData] = useState<StockingRateInputs>({
    area_ha: 0,
    animal_quantity: 0,
    average_weight_kg: 0,
  });

  const [results, setResults] = useState<StockingRateResults | null>(null);
  const [saving, setSaving] = useState(false);

  const updateFormData = (field: keyof StockingRateInputs, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setResults(null);
  };

  const handleCalculate = () => {
    if (formData.area_ha > 0 && formData.animal_quantity > 0 && formData.average_weight_kg > 0) {
      const calculatedResults = calculateStockingRate(formData);
      setResults(calculatedResults);
      onCalculate(formData, calculatedResults);
    }
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const canCalculate =
    formData.area_ha > 0 && formData.animal_quantity > 0 && formData.average_weight_kg > 0;

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'underutilized':
        return {
          bg: 'from-yellow-50 to-amber-50',
          border: 'border-yellow-300',
          text: 'text-yellow-700',
          icon: 'text-yellow-600',
        };
      case 'ideal':
        return {
          bg: 'from-green-50 to-emerald-50',
          border: 'border-green-300',
          text: 'text-green-700',
          icon: 'text-green-600',
        };
      case 'overstocked':
        return {
          bg: 'from-red-50 to-rose-50',
          border: 'border-red-300',
          text: 'text-red-700',
          icon: 'text-red-600',
        };
      default:
        return {
          bg: 'from-gray-50 to-slate-50',
          border: 'border-gray-300',
          text: 'text-gray-700',
          icon: 'text-gray-600',
        };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cálculo de Taxa de Lotação</h2>
            <p className="text-gray-600">Calcule a taxa de lotação e otimize o uso da sua pastagem</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tamanho da Área (ha)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.area_ha || ''}
              onChange={(e) => updateFormData('area_ha', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="200"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Hectares da fazenda ou piquete</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Animais
            </label>
            <input
              type="number"
              value={formData.animal_quantity || ''}
              onChange={(e) => updateFormData('animal_quantity', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="500"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Número total de cabeças na área</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso Médio dos Animais (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.average_weight_kg || ''}
              onChange={(e) => updateFormData('average_weight_kg', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="400"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Peso médio atual do rebanho</p>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!canCalculate}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          Calcular Taxa de Lotação
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div
            className={`bg-gradient-to-br ${
              getClassificationColor(results.classification).bg
            } border-2 ${getClassificationColor(results.classification).border} rounded-lg p-6 mb-6`}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {results.classification === 'ideal' ? (
                  <CheckCircle2 className={`w-12 h-12 ${getClassificationColor(results.classification).icon}`} />
                ) : results.classification === 'underutilized' ? (
                  <TrendingUp className={`w-12 h-12 ${getClassificationColor(results.classification).icon}`} />
                ) : (
                  <AlertTriangle className={`w-12 h-12 ${getClassificationColor(results.classification).icon}`} />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-bold ${getClassificationColor(results.classification).text} mb-2`}>
                  {results.classification_label}
                </h3>
                <p className="text-gray-700 leading-relaxed">{results.suggestion}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Weight className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-gray-600">Peso Total do Rebanho</p>
              </div>
              <p className="text-3xl font-bold text-blue-700">{formatNumber(results.total_weight_kg, 0)} kg</p>
              <p className="text-xs text-gray-500 mt-2">
                {formData.animal_quantity} × {formData.average_weight_kg} kg
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-600" />
                <p className="text-sm font-medium text-gray-600">Unidades Animais (UA)</p>
              </div>
              <p className="text-3xl font-bold text-purple-700">{formatNumber(results.total_animal_units, 2)} UA</p>
              <p className="text-xs text-gray-500 mt-2">
                {formatNumber(results.total_weight_kg, 0)} kg ÷ 450 kg/UA
              </p>
            </div>

            <div
              className={`bg-gradient-to-br ${
                getClassificationColor(results.classification).bg
              } border-2 ${getClassificationColor(results.classification).border} rounded-lg p-6`}
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 ${getClassificationColor(results.classification).icon}" />
                <p className="text-sm font-medium text-gray-600">Taxa de Lotação</p>
              </div>
              <p className={`text-3xl font-bold ${getClassificationColor(results.classification).text}`}>
                {formatNumber(results.stocking_rate_ua_ha, 2)} UA/ha
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {formatNumber(results.total_animal_units, 2)} UA ÷ {formData.area_ha} ha
              </p>
            </div>
          </div>

          <div className="mb-6 bg-gray-50 rounded-lg p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Referência de Classificação</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-gray-800">Subutilização</p>
                  <p className="text-sm text-gray-600">&lt; 1 UA/ha</p>
                  <p className="text-xs text-gray-500 mt-1">Potencial produtivo não explorado</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-gray-800">Ideal</p>
                  <p className="text-sm text-gray-600">1 a 3 UA/ha</p>
                  <p className="text-xs text-gray-500 mt-1">Área bem aproveitada</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-500 rounded-full flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-gray-800">Superlotação</p>
                  <p className="text-sm text-gray-600">&gt; 3 UA/ha</p>
                  <p className="text-xs text-gray-500 mt-1">Risco de degradação da pastagem</p>
                </div>
              </div>
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
