import { SimulationInputs } from '../../../lib/calculations';

type Props = {
  data: SimulationInputs;
  onUpdate: (data: Partial<SimulationInputs>) => void;
};

export function OtherExpensesStep({ data, onUpdate }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor Mensal por Cabeça (R$)
        </label>
        <input
          type="number"
          step="0.01"
          value={data.other_expenses_monthly_per_head || ''}
          onChange={(e) => onUpdate({ other_expenses_monthly_per_head: parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="3.00"
        />
        <p className="text-xs text-gray-500 mt-1">
          Veterinário, combustíveis e outras despesas médias mensais por animal
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Exemplos de Outras Despesas</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Consultas e medicamentos veterinários</li>
          <li>Vacinas e vermífugos</li>
          <li>Combustível para transporte e manejo</li>
          <li>Manutenção de cercas e instalações</li>
          <li>Energia elétrica e água</li>
          <li>Sal mineral e outros insumos</li>
        </ul>
      </div>
    </div>
  );
}
