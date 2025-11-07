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
          Valor atual da arroba no mercado (1 arroba = 15 kg)
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sobre o Valor da Arroba</h3>
        <p className="text-sm text-gray-600 mb-3">
          A arroba é a unidade de medida padrão para comercialização de gado no Brasil. Uma arroba equivale a 15 kg de peso vivo.
        </p>
        <p className="text-sm text-gray-600">
          Este valor varia conforme o mercado, região e qualidade dos animais. Consulte os preços atuais antes de preencher este campo.
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
