export type StockingRateInputs = {
  area_ha: number;
  animal_quantity: number;
  average_weight_kg: number;
};

export type StockingRateResults = {
  total_weight_kg: number;
  total_animal_units: number;
  stocking_rate_ua_ha: number;
  classification: 'underutilized' | 'ideal' | 'overstocked';
  classification_label: string;
  suggestion: string;
};

const ANIMAL_UNIT_KG = 450;

const CLASSIFICATIONS = {
  underutilized: {
    label: 'Subutilização - Potencial não explorado',
    color: 'yellow',
    threshold: { min: 0, max: 1 },
  },
  ideal: {
    label: 'Ideal - Área bem aproveitada',
    color: 'green',
    threshold: { min: 1, max: 3 },
  },
  overstocked: {
    label: 'Superlotação - Risco de degradação',
    color: 'red',
    threshold: { min: 3, max: Infinity },
  },
};

function getClassification(stockingRate: number): 'underutilized' | 'ideal' | 'overstocked' {
  if (stockingRate < 1) return 'underutilized';
  if (stockingRate <= 3) return 'ideal';
  return 'overstocked';
}

function getSuggestion(classification: 'underutilized' | 'ideal' | 'overstocked', stockingRate: number): string {
  switch (classification) {
    case 'underutilized':
      return `Sua área está subutilizada com ${stockingRate.toFixed(2)} UA/ha. Você pode aumentar o número de animais ou melhorar a pastagem com adubação para elevar a capacidade produtiva até 3 UA/ha.`;
    case 'ideal':
      return `Excelente! Sua taxa de lotação de ${stockingRate.toFixed(2)} UA/ha está dentro da faixa ideal. Continue monitorando e considere adubação estratégica para manter a qualidade da pastagem.`;
    case 'overstocked':
      return `Atenção! Sua área está superlotada com ${stockingRate.toFixed(2)} UA/ha. Isso pode causar degradação da pastagem. Considere reduzir o número de animais, dividir em piquetes ou recuperar áreas degradadas.`;
  }
}

export function calculateStockingRate(inputs: StockingRateInputs): StockingRateResults {
  const { area_ha, animal_quantity, average_weight_kg } = inputs;

  const total_weight_kg = animal_quantity * average_weight_kg;

  const total_animal_units = total_weight_kg / ANIMAL_UNIT_KG;

  const stocking_rate_ua_ha = area_ha > 0 ? total_animal_units / area_ha : 0;

  const classification = getClassification(stocking_rate_ua_ha);

  const classification_label = CLASSIFICATIONS[classification].label;

  const suggestion = getSuggestion(classification, stocking_rate_ua_ha);

  return {
    total_weight_kg,
    total_animal_units,
    stocking_rate_ua_ha,
    classification,
    classification_label,
    suggestion,
  };
}

export { CLASSIFICATIONS };
