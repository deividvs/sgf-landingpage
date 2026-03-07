export interface CarcassYieldInputs {
  quantity_animals: number;
  gmd_kg: number;
  carcass_yield_percentage: number;
  final_weight_kg?: number;
  arroba_price?: number;
}

export interface CarcassYieldResults {
  total_carcass_weight_kg?: number;
  total_arrobas?: number;
  total_revenue?: number;
  revenue_per_animal?: number;
  carcass_weight_per_animal?: number;
  arrobas_per_animal?: number;
}

export function calculateCarcassYield(inputs: CarcassYieldInputs): CarcassYieldResults {
  const results: CarcassYieldResults = {};

  if (inputs.final_weight_kg && inputs.arroba_price) {
    const carcass_yield_decimal = inputs.carcass_yield_percentage / 100;
    const kg_per_arroba = 15;

    const carcass_weight_per_animal = inputs.final_weight_kg * carcass_yield_decimal;
    const total_carcass_weight_kg = carcass_weight_per_animal * inputs.quantity_animals;

    const arrobas_per_animal = carcass_weight_per_animal / kg_per_arroba;
    const total_arrobas = total_carcass_weight_kg / kg_per_arroba;

    const revenue_per_animal = arrobas_per_animal * inputs.arroba_price;
    const total_revenue = total_arrobas * inputs.arroba_price;

    results.carcass_weight_per_animal = carcass_weight_per_animal;
    results.total_carcass_weight_kg = total_carcass_weight_kg;
    results.arrobas_per_animal = arrobas_per_animal;
    results.total_arrobas = total_arrobas;
    results.revenue_per_animal = revenue_per_animal;
    results.total_revenue = total_revenue;
  }

  return results;
}
