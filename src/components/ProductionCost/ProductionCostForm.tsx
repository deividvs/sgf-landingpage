import { useState } from 'react';
import type { ProductionCostInputs } from '../../lib/production-cost-calculator';

interface ProductionCostFormProps {
  onCalculate: (inputs: ProductionCostInputs) => void;
}

export function ProductionCostForm({ onCalculate }: ProductionCostFormProps) {
  const [formData, setFormData] = useState<ProductionCostInputs>({
    quantity_animals: 200,
    lease_monthly: 12000,
    supplementation_monthly: 8000,
    labor_monthly: 5000,
    variable_costs_monthly: 3500,
    gmd_kg: 0.478,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleChange = (field: keyof ProductionCostInputs, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Rebanho</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantidade de Animais (cabeças)
            </label>
            <input
              type="number"
              value={formData.quantity_animals}
              onChange={(e) => handleChange('quantity_animals', e.target.value)}
              min="1"
              step="1"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GMD - Ganho Médio Diário (kg/dia)
            </label>
            <input
              type="number"
              value={formData.gmd_kg}
              onChange={(e) => handleChange('gmd_kg', e.target.value)}
              min="0.1"
              max="3"
              step="0.001"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Custos Mensais</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arrendamento Mensal (R$)
            </label>
            <input
              type="number"
              value={formData.lease_monthly}
              onChange={(e) => handleChange('lease_monthly', e.target.value)}
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Suplementação Mensal (R$)
            </label>
            <input
              type="number"
              value={formData.supplementation_monthly}
              onChange={(e) => handleChange('supplementation_monthly', e.target.value)}
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mão de Obra Mensal (R$)
            </label>
            <input
              type="number"
              value={formData.labor_monthly}
              onChange={(e) => handleChange('labor_monthly', e.target.value)}
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custos Variáveis Mensais (R$)
            </label>
            <input
              type="number"
              value={formData.variable_costs_monthly}
              onChange={(e) => handleChange('variable_costs_monthly', e.target.value)}
              min="0"
              step="0.01"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Combustível, energia, medicamentos, etc.
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-600/30"
      >
        Calcular Custo de Produção
      </button>
    </form>
  );
}
