export interface AnnualResultsInputs {
  year: number;
  title: string;
  total_heads: number;
  final_average_weight_kg: number;
  carcass_yield_percentage: number;
  arroba_price: number;
  cattle_purchase_cost: number;
  freight_cost: number;
  commission_cost: number;
  personnel_cost: number;
  pasture_lease_cost: number;
  feed_supplement_medicine_cost: number;
  taxes_fees_cost: number;
  infrastructure_maintenance_cost: number;
  other_expenses_cost: number;
}

export interface AnnualResultsCalculations {
  carcass_weight_kg: number;
  arrobas_per_head: number;
  total_arrobas: number;
  total_revenue: number;
  total_cost: number;
  total_operational_expenses: number;
  revenue_per_head: number;
  cost_per_head: number;
  expense_per_head: number;
  profit_per_head: number;
  profit_margin_percentage: number;
  final_result: number;
  cost_plus_expense_per_head: number;
  cost_percentage: number;
  expense_percentage: number;
  profit_percentage: number;
  interpretation: {
    status: 'excellent' | 'good' | 'adequate' | 'concerning' | 'loss';
    message: string;
    color: string;
  };
}

export function calculateAnnualResults(inputs: AnnualResultsInputs): AnnualResultsCalculations {
  // Calcular peso de carcaça: peso vivo × rendimento de carcaça
  const carcass_weight_kg = inputs.final_average_weight_kg * (inputs.carcass_yield_percentage / 100);

  // Calcular arrobas por cabeça: peso de carcaça ÷ 15kg
  const arrobas_per_head = carcass_weight_kg / 15;

  // Calcular total de arrobas
  const total_arrobas = arrobas_per_head * inputs.total_heads;

  // Calcular receita total: total de arrobas × preço da arroba
  const total_revenue = total_arrobas * inputs.arroba_price;

  const total_cost =
    inputs.cattle_purchase_cost +
    inputs.freight_cost +
    inputs.commission_cost;

  const total_operational_expenses =
    inputs.personnel_cost +
    inputs.pasture_lease_cost +
    inputs.feed_supplement_medicine_cost +
    inputs.taxes_fees_cost +
    inputs.infrastructure_maintenance_cost +
    inputs.other_expenses_cost;

  const revenue_per_head = total_revenue / inputs.total_heads;

  const cost_per_head = total_cost / inputs.total_heads;

  const expense_per_head = total_operational_expenses / inputs.total_heads;

  const cost_plus_expense_per_head = cost_per_head + expense_per_head;

  const total_expenses_all = total_cost + total_operational_expenses;

  const final_result = total_revenue - total_expenses_all;

  const profit_per_head = revenue_per_head - cost_plus_expense_per_head;

  const profit_margin_percentage =
    total_revenue > 0 ? (final_result / total_revenue) * 100 : 0;

  const cost_percentage = total_revenue > 0 ? (total_cost / total_revenue) * 100 : 0;

  const expense_percentage = total_revenue > 0 ? (total_operational_expenses / total_revenue) * 100 : 0;

  const profit_percentage = total_revenue > 0 ? (final_result / total_revenue) * 100 : 0;

  let interpretation: AnnualResultsCalculations['interpretation'];

  if (profit_margin_percentage < 0) {
    interpretation = {
      status: 'loss',
      message: 'Operação com prejuízo. É fundamental revisar custos e estratégias de comercialização.',
      color: 'red'
    };
  } else if (profit_margin_percentage < 15) {
    interpretation = {
      status: 'concerning',
      message: 'Margem abaixo da média do setor. Considere otimizar custos operacionais.',
      color: 'orange'
    };
  } else if (profit_margin_percentage < 22) {
    interpretation = {
      status: 'adequate',
      message: 'Margem adequada, mas ainda há espaço para melhorias.',
      color: 'yellow'
    };
  } else if (profit_margin_percentage < 28) {
    interpretation = {
      status: 'good',
      message: 'Boa margem de lucro! A operação está dentro dos padrões ideais do setor.',
      color: 'green'
    };
  } else {
    interpretation = {
      status: 'excellent',
      message: 'Margem excelente! A operação está superando as expectativas do mercado.',
      color: 'green'
    };
  }

  return {
    carcass_weight_kg,
    arrobas_per_head,
    total_arrobas,
    total_revenue,
    total_cost,
    total_operational_expenses,
    revenue_per_head,
    cost_per_head,
    expense_per_head,
    profit_per_head,
    profit_margin_percentage,
    final_result,
    cost_plus_expense_per_head,
    cost_percentage,
    expense_percentage,
    profit_percentage,
    interpretation
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}
