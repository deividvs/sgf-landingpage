export type SupplementationType = 'proteinado' | 'proteico_energetico' | 'proteico_energetico_forte' | 'racao' | 'custom';

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
  proteinado: { label: 'Proteinado', percentage: 0.1 },
  proteico_energetico: { label: 'Proteico Energético', percentage: 0.2 },
  proteico_energetico_forte: { label: 'Proteico Energético Forte', percentage: 0.3 },
  racao: { label: 'Ração', percentage: 5.0 },
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
