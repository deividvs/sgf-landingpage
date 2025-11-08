import { useState } from 'react';
import {
  SupplementationInputs,
  SupplementationResults,
  SupplementationType,
  SUPPLEMENTATION_TYPES,
  calculateSupplementation,
} from '../../lib/supplementation-calculator';
import { Package, Calculator, Save, Download } from 'lucide-react';

type Props = {
  onCalculate: (inputs: SupplementationInputs, results: SupplementationResults) => void;
  onSave: (inputs: SupplementationInputs, results: SupplementationResults) => Promise<void>;
  onExportPDF: (inputs: SupplementationInputs, results: SupplementationResults) => void;
};

export function SupplementationForm({ onCalculate, onSave, onExportPDF }: Props) {
  const [formData, setFormData] = useState<SupplementationInputs>({
    animal_quantity: 0,
    average_weight_kg: 0,
    supplementation_type: 'proteinado',
    consumption_percentage: 0.1,
    bag_weight_kg: 30,
  });

  const [results, setResults] = useState<SupplementationResults | null>(null);
  const [saving, setSaving] = useState(false);

  const updateFormData = (field: keyof SupplementationInputs, value: number | SupplementationType) => {
    const newData = { ...formData, [field]: value };

    if (field === 'supplementation_type' && value !== 'custom') {
      const typeConfig = SUPPLEMENTATION_TYPES[value as SupplementationType];
      newData.consumption_percentage = typeConfig.percentage;
    }

    setFormData(newData);
    setResults(null);
  };

  const handleCalculate = () => {
    if (
      formData.animal_quantity > 0 &&
      formData.average_weight_kg > 0 &&
      formData.consumption_percentage > 0 &&
      formData.bag_weight_kg > 0
    ) {
      const calculatedResults = calculateSupplementation(formData);
      setResults(calculatedResults);
      onCalculate(formData, calculatedResults);
    }
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  const canCalculate =
    formData.animal_quantity > 0 &&
    formData.average_weight_kg > 0 &&
    formData.consumption_percentage > 0 &&
    formData.bag_weight_kg > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cálculo de Suplementação</h2>
            <p className="text-gray-600">Calcule a quantidade exata de suplemento para seu rebanho</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade de Animais
            </label>
            <input
              type="number"
              value={formData.animal_quantity || ''}
              onChange={(e) => updateFormData('animal_quantity', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="200"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Total de cabeças a suplementar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso Médio do Rebanho (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.average_weight_kg || ''}
              onChange={(e) => updateFormData('average_weight_kg', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="350"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Peso médio obtido da pesagem</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Suplementação
            </label>
            <select
              value={formData.supplementation_type}
              onChange={(e) => updateFormData('supplementation_type', e.target.value as SupplementationType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {Object.entries(SUPPLEMENTATION_TYPES).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label} {config.percentage > 0 ? `(${config.percentage}%)` : ''}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Selecione o tipo de suplemento</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Percentual de Consumo (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.consumption_percentage || ''}
              onChange={(e) => updateFormData('consumption_percentage', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="0.1"
              min="0"
              disabled={formData.supplementation_type !== 'custom'}
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.supplementation_type !== 'custom' ? 'Automático para tipo selecionado' : 'Defina o percentual'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peso do Saco (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.bag_weight_kg || ''}
              onChange={(e) => updateFormData('bag_weight_kg', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="30"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">Peso padrão do saco de suplemento</p>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          disabled={!canCalculate}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Calculator className="w-5 h-5" />
          Calcular Suplementação
        </button>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Resultados do Cálculo</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Consumo Diário Total</p>
              <p className="text-4xl font-bold text-green-700">{formatNumber(results.daily_consumption_kg, 1)} kg</p>
              <p className="text-xs text-gray-500 mt-2">
                {formData.average_weight_kg} kg × {formData.consumption_percentage}% × {formData.animal_quantity} animais
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Sacos por Dia (Exato)</p>
              <p className="text-4xl font-bold text-blue-700">{formatNumber(results.bags_per_day, 2)}</p>
              <p className="text-xs text-gray-500 mt-2">
                {formatNumber(results.daily_consumption_kg, 1)} kg ÷ {formData.bag_weight_kg} kg/saco
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Sacos por Dia (Arredondado)</p>
              <p className="text-4xl font-bold text-amber-700">{results.bags_per_day_rounded}</p>
              <p className="text-xs text-gray-500 mt-2">Quantidade prática para fornecimento</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Tabela Comparativa de Suplementação</h4>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border">Tipo</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border">% Consumo</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border">Kg/dia</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border">Sacos/dia</th>
                  </tr>
                </thead>
                <tbody>
                  {results.comparison_table.map((row, index) => (
                    <tr
                      key={row.type}
                      className={`${
                        row.type === formData.supplementation_type
                          ? 'bg-green-50 font-semibold'
                          : index % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 border">
                        {row.type_label}
                        {row.type === formData.supplementation_type && (
                          <span className="ml-2 text-xs text-green-600">(Selecionado)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-800 border">{row.percentage}%</td>
                      <td className="px-4 py-3 text-sm text-center text-gray-800 border">
                        {formatNumber(row.daily_kg, 1)}
                      </td>
                      <td className="px-4 py-3 text-sm text-center text-gray-800 border">{row.bags_per_day}</td>
                    </tr>
                  ))}
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
