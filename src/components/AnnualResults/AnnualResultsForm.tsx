import { useState } from 'react';
import { AnnualResultsInputs } from '../../lib/annual-results-calculator';

interface AnnualResultsFormProps {
  onCalculate: (inputs: AnnualResultsInputs) => void;
  initialData?: AnnualResultsInputs;
}

export function AnnualResultsForm({ onCalculate, initialData }: AnnualResultsFormProps) {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState<AnnualResultsInputs>(
    initialData || {
      year: currentYear,
      title: '',
      total_heads: 0,
      total_revenue: 0,
      cattle_purchase_cost: 0,
      freight_cost: 0,
      commission_cost: 0,
      personnel_cost: 0,
      pasture_lease_cost: 0,
      feed_supplement_medicine_cost: 0,
      taxes_fees_cost: 0,
      infrastructure_maintenance_cost: 0,
      other_expenses_cost: 0
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleChange = (field: keyof AnnualResultsInputs, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Informacoes Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano de Referencia *
            </label>
            <input
              type="number"
              required
              min="2000"
              max="2100"
              value={formData.year}
              onChange={(e) => handleChange('year', parseInt(e.target.value) || currentYear)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titulo (opcional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: Fazenda Santa Maria"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total de Cabecas *
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.total_heads || ''}
              onChange={(e) => handleChange('total_heads', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receita Total (R$) *
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.total_revenue || ''}
              onChange={(e) => handleChange('total_revenue', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Custos de Aquisicao</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compra de Gado (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.cattle_purchase_cost || ''}
              onChange={(e) => handleChange('cattle_purchase_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fretes (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.freight_cost || ''}
              onChange={(e) => handleChange('freight_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comissoes (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.commission_cost || ''}
              onChange={(e) => handleChange('commission_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Despesas Operacionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Despesas com Pessoal (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.personnel_cost || ''}
              onChange={(e) => handleChange('personnel_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aluguel de Pastos (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.pasture_lease_cost || ''}
              onChange={(e) => handleChange('pasture_lease_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Racao, Suplementos e Medicamentos (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.feed_supplement_medicine_cost || ''}
              onChange={(e) => handleChange('feed_supplement_medicine_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taxas e Impostos (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.taxes_fees_cost || ''}
              onChange={(e) => handleChange('taxes_fees_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cercas, Veiculos e Manutencao (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.infrastructure_maintenance_cost || ''}
              onChange={(e) => handleChange('infrastructure_maintenance_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Outras Despesas (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.other_expenses_cost || ''}
              onChange={(e) => handleChange('other_expenses_cost', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Calcular Resultados
        </button>
      </div>
    </form>
  );
}
