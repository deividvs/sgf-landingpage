export type MonthlyCosts = {
  supplementation: number;
  employees: number;
  feed: number;
  iatf_veterinary: number;
  fuel: number;
  vehicles: number;
  materials: number;
  taxes: number;
  other_expenses: number;
};

export type DailyCostInputs = {
  month: string;
  year: number;
  costs: MonthlyCosts;
  total_animals: number;
  supplement_cost_per_kg: number;
  supplement_quantity_per_animal_day: number;
  average_daily_gain_kg: number;
  market_arroba_price: number;
};

export type DailyCostResults = {
  total_monthly_cost: number;
  daily_cost_per_animal: number;
  daily_supplement_cost: number;
  daily_employee_cost: number;
  daily_other_costs: number;
  total_daily_cost: number;
  days_to_produce_arroba: number;
  cost_per_arroba: number;
  profit_per_arroba: number;
  is_profitable: boolean;
  cost_breakdown_percentage: CostBreakdownItem[];
};

export type CostBreakdownItem = {
  category: string;
  value: number;
  percentage: number;
};

const DAYS_IN_MONTH = 30;
const KG_PER_ARROBA = 30;

const COST_CATEGORIES = {
  supplementation: 'Suplementação',
  employees: 'Funcionários',
  feed: 'Ração',
  iatf_veterinary: 'IATF e Veterinária',
  fuel: 'Combustíveis',
  vehicles: 'Veículos',
  materials: 'Materiais de Uso e Consumo',
  taxes: 'Taxas e Impostos',
  other_expenses: 'Outras Despesas',
};

export function calculateDailyCost(inputs: DailyCostInputs): DailyCostResults {
  const { costs, total_animals, supplement_cost_per_kg, supplement_quantity_per_animal_day, average_daily_gain_kg, market_arroba_price } = inputs;

  const total_monthly_cost = Object.values(costs).reduce((sum, value) => sum + value, 0);

  const daily_cost_per_animal = total_animals > 0 ? total_monthly_cost / total_animals / DAYS_IN_MONTH : 0;

  const daily_supplement_cost = supplement_quantity_per_animal_day * supplement_cost_per_kg;

  const daily_employee_cost = total_animals > 0 ? costs.employees / total_animals / DAYS_IN_MONTH : 0;

  const other_monthly_costs =
    total_monthly_cost - costs.supplementation - costs.employees;
  const daily_other_costs = total_animals > 0 ? other_monthly_costs / total_animals / DAYS_IN_MONTH : 0;

  const total_daily_cost = daily_supplement_cost + daily_employee_cost + daily_other_costs;

  const days_to_produce_arroba = average_daily_gain_kg > 0 ? KG_PER_ARROBA / average_daily_gain_kg : 0;

  const cost_per_arroba = total_daily_cost * days_to_produce_arroba;

  const profit_per_arroba = market_arroba_price - cost_per_arroba;

  const is_profitable = profit_per_arroba > 0;

  const cost_breakdown_percentage: CostBreakdownItem[] = Object.entries(costs).map(([key, value]) => ({
    category: COST_CATEGORIES[key as keyof MonthlyCosts],
    value,
    percentage: total_monthly_cost > 0 ? (value / total_monthly_cost) * 100 : 0,
  }));

  return {
    total_monthly_cost,
    daily_cost_per_animal,
    daily_supplement_cost,
    daily_employee_cost,
    daily_other_costs,
    total_daily_cost,
    days_to_produce_arroba,
    cost_per_arroba,
    profit_per_arroba,
    is_profitable,
    cost_breakdown_percentage,
  };
}

export { COST_CATEGORIES };
