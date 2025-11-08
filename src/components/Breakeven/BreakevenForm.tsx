import { useState } from 'react';
import { BreakevenInputs } from '../../lib/breakeven-calculator';

interface BreakevenFormProps {
  onCalculate: (inputs: BreakevenInputs) => void;
  initialData?: BreakevenInputs;
}

export function BreakevenForm({ onCalculate, initialData }: BreakevenFormProps) {
  const [formData, setFormData] = useState<BreakevenInputs>(
    initialData || {
      title: '',
      acquisition_value: 0,
      daily_cost: 0,
      days_in_cycle: 0,
      final_weight_kg: 0,
      current_arroba_price: 0
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleChange = (field: keyof BreakevenInputs, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informacoes da Simulacao</h3>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titulo da Simulacao (opcional)
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ex: Simulacao Safra 2025"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor de Aquisicao (R$) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.acquisition_value || ''}
              onChange={(e) => handleChange('acquisition_value', parseFloat(e.target.value) || 0)}
              placeholder="1850.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Custo inicial por animal</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custo Diario por Animal (R$) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.daily_cost || ''}
              onChange={(e) => handleChange('daily_cost', parseFloat(e.target.value) || 0)}
              placeholder="2.60"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Soma dos custos medios diarios</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de Dias no Ciclo *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.days_in_cycle || ''}
              onChange={(e) => handleChange('days_in_cycle', parseInt(e.target.value) || 0)}
              placeholder="365"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Periodo total de recria/engorda</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso Final do Animal (kg) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.final_weight_kg || ''}
              onChange={(e) => handleChange('final_weight_kg', parseFloat(e.target.value) || 0)}
              placeholder="395"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Peso esperado na venda</p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Atual da Arroba (R$/@) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.current_arroba_price || ''}
              onChange={(e) => handleChange('current_arroba_price', parseFloat(e.target.value) || 0)}
              placeholder="300.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Preco de mercado da arroba</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Calcular Ponto de Equilibrio
        </button>
      </div>
    </form>
  );
}
