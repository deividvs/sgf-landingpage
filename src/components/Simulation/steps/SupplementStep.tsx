import { SimulationInputs } from '../../../lib/calculations';

type Props = {
  data: SimulationInputs;
  onUpdate: (data: Partial<SimulationInputs>) => void;
};

export function SupplementStep({ data, onUpdate }: Props) {
  const cost_per_kg = data.supplement_bag_weight > 0 ? data.supplement_bag_price / data.supplement_bag_weight : 0;
  const daily_cost = data.supplement_daily_consumption * cost_per_kg;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preço da Saca (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.supplement_bag_price || ''}
            onChange={(e) => onUpdate({ supplement_bag_price: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="52.50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso da Saca (kg)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.supplement_bag_weight || ''}
            onChange={(e) => onUpdate({ supplement_bag_weight: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="30"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Percentual de Fornecimento (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.supplement_percentage || ''}
            onChange={(e) => onUpdate({ supplement_percentage: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Exemplo: 0.1%, 0.2%, 0.3%
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consumo Diário por Animal (kg)
          </label>
          <input
            type="number"
            step="0.001"
            value={data.supplement_daily_consumption || ''}
            onChange={(e) => onUpdate({ supplement_daily_consumption: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.285"
          />
        </div>
      </div>

      {cost_per_kg > 0 && data.supplement_daily_consumption > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Resultados Calculados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600">Custo por kg da Suplementação</p>
              <p className="text-lg font-semibold text-gray-800">R$ {cost_per_kg.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Custo do Consumo Diário</p>
              <p className="text-lg font-semibold text-gray-800">R$ {daily_cost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sobre a Suplementação</h3>
        <p className="text-sm text-gray-600">
          A suplementação é essencial para o ganho de peso adequado. Informe o preço do suplemento (proteinado ou outro)
          e a quantidade consumida diariamente por animal.
        </p>
      </div>
    </div>
  );
}
