import { SimulationResults } from '../../../lib/calculations';

type Props = {
  results: SimulationResults;
};

export function RevenueExpenseChart({ results }: Props) {
  const maxValue = Math.max(results.total_revenue, results.total_expenses);
  const revenuePercentage = (results.total_revenue / maxValue) * 100;
  const expensePercentage = (results.total_expenses / maxValue) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Receita vs Despesas</h3>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Receita Total</span>
            <span className="text-sm font-semibold text-green-600">
              {formatCurrency(results.total_revenue)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-12 flex items-center">
            <div
              className="bg-green-500 h-12 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
              style={{ width: `${revenuePercentage}%` }}
            >
              {revenuePercentage > 20 && (
                <span className="text-white font-semibold text-sm">
                  {formatCurrency(results.total_revenue)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Despesas Totais</span>
            <span className="text-sm font-semibold text-red-600">
              {formatCurrency(results.total_expenses)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-12 flex items-center">
            <div
              className="bg-red-500 h-12 rounded-full flex items-center justify-end pr-3 transition-all duration-500"
              style={{ width: `${expensePercentage}%` }}
            >
              {expensePercentage > 20 && (
                <span className="text-white font-semibold text-sm">
                  {formatCurrency(results.total_expenses)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-800">Resultado Líquido</span>
            <span className={`text-lg font-bold ${results.total_revenue - results.total_expenses > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(results.total_revenue - results.total_expenses)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
