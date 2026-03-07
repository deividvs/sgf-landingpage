import { useState } from 'react';
import { SupplementationCochoInputs, getDefaultPercentage } from '../../lib/supplementation-cocho-calculator';

interface SupplementationCochoFormProps {
  onCalculate: (inputs: SupplementationCochoInputs) => void;
  initialData?: SupplementationCochoInputs;
}

export function SupplementationCochoForm({ onCalculate, initialData }: SupplementationCochoFormProps) {
  const [formData, setFormData] = useState<SupplementationCochoInputs>(
    initialData || {
      title: '',
      quantity_heads: 0,
      average_weight_kg: 0,
      supplementation_type: 'Proteinado',
      consumption_percentage: 0.1,
      bag_weight_kg: 30
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleChange = (field: keyof SupplementationCochoInputs, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTypeChange = (type: string) => {
    const percentage = type === 'Personalizado' ? formData.consumption_percentage : getDefaultPercentage(type);
    setFormData((prev) => ({
      ...prev,
      supplementation_type: type as SupplementationCochoInputs['supplementation_type'],
      consumption_percentage: percentage
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informações da Simulação</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título da Simulação (opcional)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ex: Rebanho Pasto A - Janeiro 2025"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de Cabeças *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity_heads || ''}
              onChange={(e) => handleChange('quantity_heads', parseInt(e.target.value) || 0)}
              placeholder="200"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Número de animais a serem suplementados</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso Médio do Rebanho (kg) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.average_weight_kg || ''}
              onChange={(e) => handleChange('average_weight_kg', parseFloat(e.target.value) || 0)}
              placeholder="350"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Peso médio estimado dos animais</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Suplementação *
            </label>
            <select
              value={formData.supplementation_type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Proteinado">Proteinado (0,1%)</option>
              <option value="Proteico Energetico">Proteico Energético (0,2%)</option>
              <option value="Proteico Energetico Forte">Proteico Energético Forte (0,3%)</option>
              <option value="Racao">Ração (5,0%)</option>
              <option value="Personalizado">Personalizado</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Define o percentual padrão de consumo</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Percentual de Consumo (%) *
            </label>
            <input
              type="number"
              required
              min="0"
              max="10"
              step="0.01"
              value={formData.consumption_percentage || ''}
              onChange={(e) => handleChange('consumption_percentage', parseFloat(e.target.value) || 0)}
              disabled={formData.supplementation_type !== 'Personalizado'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.supplementation_type !== 'Personalizado'
                ? 'Automático conforme tipo selecionado'
                : 'Insira o percentual desejado'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso do Saco (kg) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="1"
              value={formData.bag_weight_kg || ''}
              onChange={(e) => handleChange('bag_weight_kg', parseFloat(e.target.value) || 30)}
              placeholder="30"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Padrao de mercado (normalmente 30 kg)</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Calcular Quantidade
        </button>
      </div>
    </form>
  );
}
