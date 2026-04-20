export interface BreakevenInputs {
  title: string;
  acquisition_value: number;
  daily_cost: number;
  days_in_cycle: number;
  final_weight_kg: number;
  current_arroba_price: number;
}

export interface BreakevenCalculations {
  total_revenue: number;
  total_expenses: number;
  total_arrobas: number;
  breakeven_price: number;
  profit_per_arroba: number;
  final_result: number;
  status: 'profit' | 'breakeven' | 'loss';
  interpretation: {
    message: string;
    color: string;
    icon: string;
  };
}

export function calculateBreakeven(inputs: BreakevenInputs): BreakevenCalculations {
  const ARROBA_KG = 30;

  const total_arrobas = inputs.final_weight_kg / ARROBA_KG;

  const total_revenue = total_arrobas * inputs.current_arroba_price;

  const total_expenses = (inputs.daily_cost * inputs.days_in_cycle) + inputs.acquisition_value;

  const breakeven_price = total_expenses / total_arrobas;

  const profit_per_arroba = inputs.current_arroba_price - breakeven_price;

  const final_result = profit_per_arroba * total_arrobas;

  let status: 'profit' | 'breakeven' | 'loss';
  let interpretation: BreakevenCalculations['interpretation'];

  const difference = Math.abs(inputs.current_arroba_price - breakeven_price);

  if (difference < 0.01) {
    status = 'breakeven';
    interpretation = {
      message: 'Operação no ponto de equilíbrio. Não há lucro nem prejuízo neste cenário.',
      color: 'yellow',
      icon: '⚖️'
    };
  } else if (inputs.current_arroba_price > breakeven_price) {
    status = 'profit';
    interpretation = {
      message: `Operação lucrativa! Com arroba a ${formatCurrency(inputs.current_arroba_price)}, você tem lucro de ${formatCurrency(profit_per_arroba)} por arroba.`,
      color: 'green',
      icon: '💰'
    };
  } else {
    status = 'loss';
    interpretation = {
      message: `Operação com prejuízo. O preço da arroba está ${formatCurrency(Math.abs(profit_per_arroba))} abaixo do ponto de equilíbrio.`,
      color: 'red',
      icon: '📉'
    };
  }

  return {
    total_revenue,
    total_expenses,
    total_arrobas,
    breakeven_price,
    profit_per_arroba,
    final_result,
    status,
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
