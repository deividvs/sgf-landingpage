export interface ProductionCostInputs {
  quantity_animals: number;
  lease_monthly: number;
  supplementation_monthly: number;
  labor_monthly: number;
  variable_costs_monthly: number;
  gmd_kg: number;
  carcass_yield_percentage: number;
  final_weight_kg?: number;
  arroba_price?: number;
}

export interface ProductionCostResults {
  total_monthly_expense: number;
  monthly_expense_per_animal: number;
  daily_cost_per_animal: number;
  days_per_arroba: number;
  cost_per_arroba: number;
  classification: 'excelente' | 'media' | 'alto_custo';
  carcass_weight_kg?: number;
  total_arrobas?: number;
  total_revenue?: number;
  revenue_per_animal?: number;
}

export function calculateProductionCost(inputs: ProductionCostInputs): ProductionCostResults {
  const total_monthly_expense =
    inputs.lease_monthly +
    inputs.supplementation_monthly +
    inputs.labor_monthly +
    inputs.variable_costs_monthly;

  const monthly_expense_per_animal = total_monthly_expense / inputs.quantity_animals;

  const daily_cost_per_animal = monthly_expense_per_animal / 30;

  const carcass_yield_decimal = inputs.carcass_yield_percentage / 100;
  const kg_carcass_per_arroba = 15;
  const kg_live_weight_per_arroba = kg_carcass_per_arroba / carcass_yield_decimal;
  const days_per_arroba = kg_live_weight_per_arroba / inputs.gmd_kg;

  const cost_per_arroba = daily_cost_per_animal * days_per_arroba;

  let classification: 'excelente' | 'media' | 'alto_custo';
  if (cost_per_arroba < 270) {
    classification = 'excelente';
  } else if (cost_per_arroba <= 320) {
    classification = 'media';
  } else {
    classification = 'alto_custo';
  }

  const results: ProductionCostResults = {
    total_monthly_expense,
    monthly_expense_per_animal,
    daily_cost_per_animal,
    days_per_arroba,
    cost_per_arroba,
    classification,
  };

  if (inputs.final_weight_kg && inputs.arroba_price) {
    const carcass_weight_kg = inputs.final_weight_kg * carcass_yield_decimal;
    const total_arrobas = carcass_weight_kg / kg_carcass_per_arroba;
    const total_revenue = total_arrobas * inputs.arroba_price;
    const revenue_per_animal = total_revenue;

    results.carcass_weight_kg = carcass_weight_kg;
    results.total_arrobas = total_arrobas;
    results.total_revenue = total_revenue;
    results.revenue_per_animal = revenue_per_animal;
  }

  return results;
}
