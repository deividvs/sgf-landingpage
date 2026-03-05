export interface ProductionCostInputs {
  quantity_animals: number;
  lease_monthly: number;
  supplementation_monthly: number;
  labor_monthly: number;
  variable_costs_monthly: number;
  gmd_kg: number;
}

export interface ProductionCostResults {
  total_monthly_expense: number;
  monthly_expense_per_animal: number;
  daily_cost_per_animal: number;
  days_per_arroba: number;
  cost_per_arroba: number;
  classification: 'excelente' | 'media' | 'alto_custo';
}

export function calculateProductionCost(inputs: ProductionCostInputs): ProductionCostResults {
  const total_monthly_expense =
    inputs.lease_monthly +
    inputs.supplementation_monthly +
    inputs.labor_monthly +
    inputs.variable_costs_monthly;

  const monthly_expense_per_animal = total_monthly_expense / inputs.quantity_animals;

  const daily_cost_per_animal = monthly_expense_per_animal / 30;

  const carcass_yield_decimal = 0.52;
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

  return {
    total_monthly_expense,
    monthly_expense_per_animal,
    daily_cost_per_animal,
    days_per_arroba,
    cost_per_arroba,
    classification,
  };
}
