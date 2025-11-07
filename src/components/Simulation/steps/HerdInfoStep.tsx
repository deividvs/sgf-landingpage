import { SimulationInputs } from '../../../lib/calculations';

type Props = {
  data: SimulationInputs;
  onUpdate: (data: Partial<SimulationInputs>) => void;
};

export function HerdInfoStep({ data, onUpdate }: Props) {
  const weight_to_gain = data.final_weight - data.initial_weight;
  const months_to_sell = data.average_daily_gain > 0 ? (weight_to_gain / data.average_daily_gain) / 30 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição do Lote
          </label>
          <input
            type="text"
            value={data.herd_description}
            onChange={(e) => onUpdate({ herd_description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Ex: Bezerras"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantidade de Animais
          </label>
          <input
            type="number"
            value={data.quantity || ''}
            onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="13"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso Inicial por Cabeça (kg)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.initial_weight || ''}
            onChange={(e) => onUpdate({ initial_weight: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="180"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso Final por Cabeça (kg)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.final_weight || ''}
            onChange={(e) => onUpdate({ final_weight: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="390"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor de Aquisição por Cabeça (R$)
          </label>
          <input
            type="number"
            step="0.01"
            value={data.acquisition_value_per_kg || ''}
            onChange={(e) => onUpdate({ acquisition_value_per_kg: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="1800.00"
          />
          <p className="text-xs text-gray-500 mt-1">
            Valor total pago por cada animal na compra
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GMD - Ganho Médio Diário (kg)
          </label>
          <input
            type="number"
            step="0.001"
            value={data.average_daily_gain || ''}
            onChange={(e) => onUpdate({ average_daily_gain: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0.583"
          />
        </div>
      </div>

      {data.initial_weight > 0 && data.final_weight > data.initial_weight && data.average_daily_gain > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Resultados Calculados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-600">Peso a Ganhar</p>
              <p className="text-lg font-semibold text-gray-800">{weight_to_gain.toFixed(2)} kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Número de Meses para Vender</p>
              <p className="text-lg font-semibold text-gray-800">{months_to_sell.toFixed(2)} meses</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Dica:</strong> Os campos com fundo branco são editáveis. Os campos com fundo amarelo mostram resultados calculados automaticamente.
        </p>
      </div>
    </div>
  );
}
