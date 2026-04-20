import { SimulationInputs } from '../../../lib/calculations';

type Props = {
  data: SimulationInputs;
  onUpdate: (data: Partial<SimulationInputs>) => void;
};

export function LeaseStep({ data, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor Mensal por Cabeça (R$)
        </label>
        <input
          type="number"
          step="0.01"
          value={data.lease_monthly_per_head || ''}
          onChange={(e) => onUpdate({ lease_monthly_per_head: parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="55.00"
        />
        <p className="text-xs text-gray-500 mt-1">
          Custo mensal de arrendamento por animal
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Sobre o Arrendamento</h3>
        <p className="text-sm text-gray-600">
          O arrendamento é o custo de aluguel da pastagem ou área onde os animais ficarão durante o período de engorda.
          Este valor é multiplicado pelo número de animais e pelo período total da operação.
        </p>
      </div>
    </div>
  );
}
