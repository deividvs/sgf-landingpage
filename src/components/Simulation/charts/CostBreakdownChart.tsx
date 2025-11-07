import { SimulationResults } from '../../../lib/calculations';

type Props = {
  results: SimulationResults;
};

export function CostBreakdownChart({ results }: Props) {
  const total = results.acquisition_costs + results.lease_costs + results.labor_costs + results.supplement_costs + results.other_costs;

  const data = [
    { label: 'Reposição', value: results.acquisition_costs, color: 'bg-blue-500' },
    { label: 'Arrendamento', value: results.lease_costs, color: 'bg-green-500' },
    { label: 'Mão de Obra', value: results.labor_costs, color: 'bg-yellow-500' },
    { label: 'Suplementação', value: results.supplement_costs, color: 'bg-red-500' },
    { label: 'Outras', value: results.other_costs, color: 'bg-purple-500' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Composição dos Custos</h3>
      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={index}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                <span className="text-sm text-gray-600">
                  {formatCurrency(item.value)} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${item.color} h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">Total</span>
          <span className="text-lg font-bold text-gray-800">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
