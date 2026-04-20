export type SimulationInputs = {
  herd_description: string;
  quantity: number;
  initial_weight: number;
  final_weight: number;
  carcass_yield_percentage: number;
  acquisition_value_per_kg: number;
  average_daily_gain: number;
  lease_monthly_per_head: number;
  workers_count: number;
  labor_monthly_per_worker: number;
  supplement_bag_price: number;
  supplement_bag_weight: number;
  supplement_percentage: number;
  supplement_daily_consumption: number;
  other_expenses_monthly_per_head: number;
  arroba_value: number;
};

export type SimulationResults = {
  weight_to_gain: number;
  months_to_sell: number;
  carcass_weight_kg: number;
  arrobas_per_head: number;
  total_arrobas: number;
  total_revenue: number;
  acquisition_costs: number;
  lease_costs: number;
  labor_costs: number;
  supplement_costs: number;
  other_costs: number;
  total_expenses: number;
  profit_margin_percentage: number;
  result_per_animal: number;
  cost_per_arroba: number;
  monthly_lease_cost: number;
  monthly_labor_cost: number;
  monthly_supplement_cost: number;
  monthly_other_cost: number;
  monthly_cost_total: number;
};

const ARROBA_KG = 15;

export function calculateSimulation(inputs: SimulationInputs): SimulationResults {
  const {
    quantity,
    initial_weight,
    final_weight,
    carcass_yield_percentage,
    acquisition_value_per_kg,
    average_daily_gain,
    lease_monthly_per_head,
    workers_count,
    labor_monthly_per_worker,
    supplement_bag_price,
    supplement_bag_weight,
    supplement_daily_consumption,
    other_expenses_monthly_per_head,
    arroba_value,
  } = inputs;

  const weight_to_gain = final_weight - initial_weight;
  const days_to_sell = weight_to_gain / average_daily_gain;
  const months_to_sell = days_to_sell / 30;

  const carcass_weight_kg = final_weight * (carcass_yield_percentage / 100);
  const arrobas_per_head = carcass_weight_kg / ARROBA_KG;
  const total_arrobas = quantity * arrobas_per_head;
  const total_revenue = total_arrobas * arroba_value;

  const acquisition_costs = quantity * acquisition_value_per_kg;

  const monthly_lease_cost = lease_monthly_per_head;
  const lease_costs = quantity * lease_monthly_per_head * months_to_sell;

  const labor_monthly_total = labor_monthly_per_worker * workers_count;
  const monthly_labor_cost = quantity > 0 ? labor_monthly_total / quantity : 0;
  const labor_costs = labor_monthly_total * months_to_sell;

  const cost_per_kg_supplement = supplement_bag_price / supplement_bag_weight;
  const daily_supplement_cost = supplement_daily_consumption * cost_per_kg_supplement;
  const monthly_supplement_cost = daily_supplement_cost * 30;
  const supplement_costs = quantity * daily_supplement_cost * days_to_sell;

  const monthly_other_cost = other_expenses_monthly_per_head;
  const other_costs = quantity * other_expenses_monthly_per_head * months_to_sell;

  const total_expenses = acquisition_costs + lease_costs + labor_costs + supplement_costs + other_costs;

  const monthly_cost_total = monthly_lease_cost + monthly_labor_cost + monthly_supplement_cost + monthly_other_cost;

  const result_total = total_revenue - total_expenses;
  const result_per_animal = result_total / quantity;
  const profit_margin_percentage = total_revenue > 0 ? (result_total / total_revenue) * 100 : 0;

  const cost_per_arroba = total_arrobas > 0 ? total_expenses / total_arrobas : 0;

  return {
    weight_to_gain,
    months_to_sell,
    carcass_weight_kg,
    arrobas_per_head,
    total_arrobas,
    total_revenue,
    acquisition_costs,
    lease_costs,
    labor_costs,
    supplement_costs,
    other_costs,
    total_expenses,
    profit_margin_percentage,
    result_per_animal,
    cost_per_arroba,
    monthly_lease_cost,
    monthly_labor_cost,
    monthly_supplement_cost,
    monthly_other_cost,
    monthly_cost_total,
  };
}
