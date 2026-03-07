import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface SupplierInput {
  name: string;
  city: string;
  distance_km: number;
  quantity: number;
  weight_kg: number;
  price_per_kg: number;
  commission_percentage: number;
  icms_percentage: number;
  freight_per_km: number;
  toll_value: number;
  quality_score: number;
}

interface PurchaseFormProps {
  onSubmit: (suppliers: SupplierInput[]) => void;
  initialSuppliers?: SupplierInput[];
}

const defaultSupplier: SupplierInput = {
  name: '',
  city: '',
  distance_km: 200,
  quantity: 50,
  weight_kg: 220,
  price_per_kg: 12.0,
  commission_percentage: 0,
  icms_percentage: 0,
  freight_per_km: 6.0,
  toll_value: 0,
  quality_score: 8,
};

export default function PurchaseForm({ onSubmit, initialSuppliers }: PurchaseFormProps) {
  const [suppliers, setSuppliers] = useState<SupplierInput[]>(
    initialSuppliers && initialSuppliers.length > 0
      ? initialSuppliers
      : [{ ...defaultSupplier }]
  );

  const addSupplier = () => {
    setSuppliers([...suppliers, { ...defaultSupplier }]);
  };

  const removeSupplier = (index: number) => {
    if (suppliers.length > 1) {
      setSuppliers(suppliers.filter((_, i) => i !== index));
    }
  };

  const updateSupplier = (index: number, field: keyof SupplierInput, value: string | number) => {
    const updated = [...suppliers];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setSuppliers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(suppliers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {suppliers.map((supplier, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Fornecedor {index + 1}
            </h3>
            {suppliers.length > 1 && (
              <button
                type="button"
                onClick={() => removeSupplier(index)}
                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Fornecedor
              </label>
              <input
                type="text"
                value={supplier.name}
                onChange={(e) => updateSupplier(index, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade/Estado
              </label>
              <input
                type="text"
                value={supplier.city}
                onChange={(e) => updateSupplier(index, 'city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distância (km)
              </label>
              <input
                type="number"
                value={supplier.distance_km}
                onChange={(e) => updateSupplier(index, 'distance_km', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade (cabeças)
              </label>
              <input
                type="number"
                value={supplier.quantity}
                onChange={(e) => updateSupplier(index, 'quantity', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso Médio (kg)
              </label>
              <input
                type="number"
                value={supplier.weight_kg}
                onChange={(e) => updateSupplier(index, 'weight_kg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="1"
                step="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço por Kg (R$)
              </label>
              <input
                type="number"
                value={supplier.price_per_kg}
                onChange={(e) => updateSupplier(index, 'price_per_kg', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comissão (%)
              </label>
              <input
                type="number"
                value={supplier.commission_percentage}
                onChange={(e) => updateSupplier(index, 'commission_percentage', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ICMS (%)
              </label>
              <input
                type="number"
                value={supplier.icms_percentage}
                onChange={(e) => updateSupplier(index, 'icms_percentage', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frete por Km (R$)
              </label>
              <input
                type="number"
                value={supplier.freight_per_km}
                onChange={(e) => updateSupplier(index, 'freight_per_km', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pedágio (R$)
              </label>
              <input
                type="number"
                value={supplier.toll_value}
                onChange={(e) => updateSupplier(index, 'toll_value', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualidade (0-10)
              </label>
              <input
                type="number"
                value={supplier.quality_score}
                onChange={(e) => updateSupplier(index, 'quality_score', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0"
                max="10"
                step="1"
                required
              />
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={addSupplier}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Plus size={20} />
          Adicionar Fornecedor
        </button>

        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Calcular Simulação
        </button>
      </div>
    </form>
  );
}
