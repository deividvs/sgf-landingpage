import { SimulationInputs } from '../../../lib/calculations';

type Props = {
  data: SimulationInputs;
  onUpdate: (data: Partial<SimulationInputs>) => void;
};

export function LaborStep({ data, onUpdate }: Props) {
  const labor_monthly_total = (data.labor_monthly_per_worker || 0) * (data.workers_count || 0);
  const monthlyCostPerHead = data.quantity > 0 ? labor_monthly_total / data.quantity : 0;
  const weight_to_gain = data.final_weight - data.initial_weight;
  const months_to_sell = data.average_daily_gain > 0 ? (weight_to_gain / data.average_daily_gain) / 30 : 0;
  const totalLaborCost = labor_monthly_total * months_to_sell;
  const costPerAnimal = data.quantity > 0 ? totalLaborCost / data.quantity : 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quantidade de Funcionários
        </label>
        <input
          type="number"
          value={data.workers_count || ''}
          onChange={(e) => onUpdate({ workers_count: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="1"
          min="0"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Salário Mensal por Funcionário (R$)
        </label>
        <input
          type="number"
          step="0.01"
          value={data.labor_monthly_per_worker || ''}
          onChange={(e) => onUpdate({ labor_monthly_per_worker: parseFloat(e.target.value) || 0 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="1950.00"
          min="0"
        />
        <p className="text-xs text-gray-500 mt-1">
          Valor com encargos trabalhistas e benefícios para 1 funcionário
        </p>
      </div>

      {labor_monthly_total > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">💰 Custo Mensal Total de Mão de Obra</h3>
          <p className="text-2xl font-bold text-green-700">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(labor_monthly_total)}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {data.workers_count} funcionário(s) × {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.labor_monthly_per_worker || 0)}
          </p>
        </div>
      )}

      {labor_monthly_total > 0 && data.quantity > 0 && months_to_sell > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">📊 Resultados Calculados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Custo Mensal por Cabeça</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyCostPerHead)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Período Total</p>
              <p className="text-lg font-semibold text-gray-800">{months_to_sell.toFixed(2)} meses</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Custo Total de Mão de Obra</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalLaborCost)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Custo por Animal (Total)</p>
              <p className="text-lg font-semibold text-gray-800">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(costPerAnimal)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Como funciona o cálculo?</h3>
        <div className="text-sm text-gray-700 space-y-2">
          <p>
            <strong>1.</strong> Custo mensal total = salário por funcionário × quantidade de funcionários
          </p>
          <p>
            <strong>2.</strong> Custo total da operação = custo mensal total × meses até a venda
          </p>
          <p>
            <strong>3.</strong> Este custo é então <strong>dividido entre todos os animais</strong>
          </p>
          <div className="mt-3 p-3 bg-white rounded border border-blue-300">
            <p className="font-semibold text-blue-900 mb-1">Exemplo:</p>
            <p>1 funcionário × R$ 1.950,00 × 12,01 meses = <strong>R$ 23.419,50</strong></p>
            <p>R$ 23.419,50 ÷ 13 animais = <strong>R$ 1.801,50 por animal</strong></p>
            <p>R$ 1.801,50 ÷ 12,01 meses = <strong>R$ 149,94/mês por cabeça</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
