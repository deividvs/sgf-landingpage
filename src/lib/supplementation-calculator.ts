export type SupplementationType =
  | 'proteinado_01'
  | 'proteinado_02'
  | 'proteico_energetico_03'
  | 'proteico_energetico_04'
  | 'proteico_energetico_05'
  | 'concentrado_engorda_1'
  | 'concentrado_engorda_15'
  | 'concentrado_engorda_2'
  | 'custom';

export type SupplementationInputs = {
  animal_quantity: number;
  average_weight_kg: number;
  supplementation_type: SupplementationType;
  consumption_percentage: number;
  bag_weight_kg: number;
};

export type SupplementationResults = {
  daily_consumption_kg: number;
  bags_per_day: number;
  bags_per_day_rounded: number;
  comparison_table: SupplementationComparison[];
};

export type SupplementationComparison = {
  type: string;
  type_label: string;
  percentage: number;
  daily_kg: number;
  bags_per_day: number;
};

export const SUPPLEMENTATION_TYPES = {
  proteinado_01: { label: 'Proteinado', percentage: 0.1 },
  proteinado_02: { label: 'Proteinado', percentage: 0.2 },
  proteico_energetico_03: { label: 'Proteico energético', percentage: 0.3 },
  proteico_energetico_04: { label: 'Proteico energético', percentage: 0.4 },
  proteico_energetico_05: { label: 'Proteico energético', percentage: 0.5 },
  concentrado_engorda_1: { label: 'Concentrado engorda', percentage: 1.0 },
  concentrado_engorda_15: { label: 'Concentrado engorda', percentage: 1.5 },
  concentrado_engorda_2: { label: 'Concentrado engorda', percentage: 2.0 },
  custom: { label: 'Personalizado', percentage: 0 },
};

export function calculateSupplementation(inputs: SupplementationInputs): SupplementationResults {
  const {
    animal_quantity,
    average_weight_kg,
    consumption_percentage,
    bag_weight_kg,
  } = inputs;

  const daily_consumption_kg =
    average_weight_kg * (consumption_percentage / 100) * animal_quantity;

  const bags_per_day = bag_weight_kg > 0 ? daily_consumption_kg / bag_weight_kg : 0;

  const bags_per_day_rounded = Math.ceil(bags_per_day);

  const comparison_table: SupplementationComparison[] = Object.entries(SUPPLEMENTATION_TYPES)
    .filter(([key]) => key !== 'custom')
    .map(([key, config]) => {
      const daily_kg = average_weight_kg * (config.percentage / 100) * animal_quantity;
      const bags = bag_weight_kg > 0 ? daily_kg / bag_weight_kg : 0;
      return {
        type: key,
        type_label: config.label,
        percentage: config.percentage,
        daily_kg,
        bags_per_day: Math.ceil(bags),
      };
    });

  return {
    daily_consumption_kg,
    bags_per_day,
    bags_per_day_rounded,
    comparison_table,
  };
}
