export interface SupplementationCochoInputs {
  title: string;
  quantity_heads: number;
  average_weight_kg: number;
  supplementation_type: 'Proteinado' | 'Proteico Energetico' | 'Proteico Energetico Forte' | 'Racao' | 'Personalizado';
  consumption_percentage: number;
  bag_weight_kg: number;
}

export interface SupplementationCochoCalculations {
  daily_consumption_kg: number;
  bags_per_day: number;
  bags_per_day_rounded: number;
  comparative_data: {
    type: string;
    percentage: number;
    daily_kg: number;
    bags: number;
  }[];
}

const SUPPLEMENTATION_TYPES = {
  'Proteinado': 0.1,
  'Proteico Energetico': 0.2,
  'Proteico Energetico Forte': 0.3,
  'Racao': 5.0
};

export function getDefaultPercentage(type: string): number {
  return SUPPLEMENTATION_TYPES[type as keyof typeof SUPPLEMENTATION_TYPES] || 0.1;
}

export function calculateSupplementationCocho(inputs: SupplementationCochoInputs): SupplementationCochoCalculations {
  const daily_consumption_kg = inputs.quantity_heads * inputs.average_weight_kg * (inputs.consumption_percentage / 100);

  const bags_per_day = daily_consumption_kg / inputs.bag_weight_kg;
  const bags_per_day_rounded = Math.ceil(bags_per_day);

  const comparative_data = Object.entries(SUPPLEMENTATION_TYPES).map(([type, percentage]) => {
    const daily_kg = inputs.quantity_heads * inputs.average_weight_kg * (percentage / 100);
    const bags = daily_kg / inputs.bag_weight_kg;

    return {
      type,
      percentage,
      daily_kg,
      bags: Math.ceil(bags)
    };
  });

  return {
    daily_consumption_kg,
    bags_per_day,
    bags_per_day_rounded,
    comparative_data
  };
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}
