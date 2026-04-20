import { SimulationInputs } from '../../../lib/calculations';

type Props = {
  data: SimulationInputs;
  onUpdate: (data: Partial<SimulationInputs>) => void;
};

export function ArrobaValueStep({ data, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rendimento de Carcaça (%)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={data.carcass_yield_percentage || ''}
          onChange={(e) => onUpdate({ carcass_yield_percentage: parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="52"
        />
        <p className="text-xs text-gray-500 mt-1">
          Tipicamente entre 50% e 55%
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor da Arroba (R$)
        </label>
        <input
          type="number"
          step="0.01"
          value={data.arroba_value || ''}
          onChange={(e) => onUpdate({ arroba_value: parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="300.00"
        />
        <p className="text-xs text-gray-500 mt-1">
          Valor atual da arroba no mercado (1 arroba = 15 kg de carcaça)
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Como funciona o cálculo</h3>
        <p className="text-sm text-gray-600 mb-3">
          1 arroba = 15 kg de <strong>carcaça</strong> (não peso vivo)
        </p>
        <p className="text-sm text-gray-600 mb-3">
          Exemplo: Animal de 600kg com rendimento de 52%
          <br />
          • Peso de carcaça: 600kg × 52% = 312kg
          <br />
          • Arrobas: 312kg ÷ 15 = 20,8 @
          <br />
          • Receita: 20,8 @ × preço da arroba
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Pronto para calcular!</strong> Clique em "Calcular Resultados" para ver a viabilidade da sua operação.
        </p>
      </div>
    </div>
  );
}
