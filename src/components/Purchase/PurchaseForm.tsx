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

type SupplierRaw = {
  [K in keyof SupplierInput]: string;
};

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

function toRaw(supplier: SupplierInput): SupplierRaw {
  return {
    name: supplier.name,
    city: supplier.city,
    distance_km: String(supplier.distance_km),
    quantity: String(supplier.quantity),
    weight_kg: String(supplier.weight_kg),
    price_per_kg: String(supplier.price_per_kg),
    commission_percentage: String(supplier.commission_percentage),
    icms_percentage: String(supplier.icms_percentage),
    freight_per_km: String(supplier.freight_per_km),
    toll_value: String(supplier.toll_value),
    quality_score: String(supplier.quality_score),
  };
}

function parseDecimal(value: string): number {
  const normalized = value.replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

export default function PurchaseForm({ onSubmit, initialSuppliers }: PurchaseFormProps) {
  const initialList =
    initialSuppliers && initialSuppliers.length > 0
      ? initialSuppliers
      : [{ ...defaultSupplier }];

  const [suppliers, setSuppliers] = useState<SupplierInput[]>(initialList);
  const [suppliersRaw, setSuppliersRaw] = useState<SupplierRaw[]>(
    initialList.map(toRaw)
  );

  const addSupplier = () => {
    setSuppliers([...suppliers, { ...defaultSupplier }]);
    setSuppliersRaw([...suppliersRaw, toRaw(defaultSupplier)]);
  };

  const removeSupplier = (index: number) => {
    if (suppliers.length > 1) {
      setSuppliers(suppliers.filter((_, i) => i !== index));
      setSuppliersRaw(suppliersRaw.filter((_, i) => i !== index));
    }
  };

  const updateSupplierText = (index: number, field: 'name' | 'city', value: string) => {
    const updatedRaw = [...suppliersRaw];
    updatedRaw[index] = { ...updatedRaw[index], [field]: value };
    setSuppliersRaw(updatedRaw);

    const updated = [...suppliers];
    updated[index] = { ...updated[index], [field]: value };
    setSuppliers(updated);
  };

  const updateSupplierNumber = (
    index: number,
    field: keyof Omit<SupplierInput, 'name' | 'city'>,
    rawValue: string
  ) => {
    const normalized = rawValue.replace(',', '.');

    const updatedRaw = [...suppliersRaw];
    updatedRaw[index] = { ...updatedRaw[index], [field]: rawValue };
    setSuppliersRaw(updatedRaw);

    const parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      const updated = [...suppliers];
      updated[index] = { ...updated[index], [field]: parsed };
      setSuppliers(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSuppliers = suppliers.map((supplier, index) => {
      const raw = suppliersRaw[index];
      return {
        ...supplier,
        distance_km: parseDecimal(raw.distance_km),
        quantity: parseDecimal(raw.quantity),
        weight_kg: parseDecimal(raw.weight_kg),
        price_per_kg: parseDecimal(raw.price_per_kg),
        commission_percentage: parseDecimal(raw.commission_percentage),
        icms_percentage: parseDecimal(raw.icms_percentage),
        freight_per_km: parseDecimal(raw.freight_per_km),
        toll_value: parseDecimal(raw.toll_value),
        quality_score: parseDecimal(raw.quality_score),
      };
    });
    onSubmit(finalSuppliers);
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
                onChange={(e) => updateSupplierText(index, 'name', e.target.value)}
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
                onChange={(e) => updateSupplierText(index, 'city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distância (km)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.distance_km ?? supplier.distance_km}
                onChange={(e) => updateSupplierNumber(index, 'distance_km', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantidade (cabeças)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.quantity ?? supplier.quantity}
                onChange={(e) => updateSupplierNumber(index, 'quantity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso Médio (kg)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.weight_kg ?? supplier.weight_kg}
                onChange={(e) => updateSupplierNumber(index, 'weight_kg', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço por Kg (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.price_per_kg ?? supplier.price_per_kg}
                onChange={(e) => updateSupplierNumber(index, 'price_per_kg', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comissão (%)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.commission_percentage ?? supplier.commission_percentage}
                onChange={(e) => updateSupplierNumber(index, 'commission_percentage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ICMS (%)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.icms_percentage ?? supplier.icms_percentage}
                onChange={(e) => updateSupplierNumber(index, 'icms_percentage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frete por Km (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.freight_per_km ?? supplier.freight_per_km}
                onChange={(e) => updateSupplierNumber(index, 'freight_per_km', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pedágio Total (R$)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.toll_value ?? supplier.toll_value}
                onChange={(e) => updateSupplierNumber(index, 'toll_value', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualidade (0-10)
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={suppliersRaw[index]?.quality_score ?? supplier.quality_score}
                onChange={(e) => updateSupplierNumber(index, 'quality_score', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
