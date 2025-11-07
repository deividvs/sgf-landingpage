export type PremiumInputs = {
  current_arroba_value: number;
  animal_paid_value: number;
  purchase_weight_kg: number;
  rearing_period_days: number;
};

export type PremiumResults = {
  paid_price_per_arroba: number;
  premium_discount_per_arroba: number;
  premium_discount_percentage: number;
  total_premium_discount_per_animal: number;
  additional_weight_needed_kg: number;
  daily_gain_needed_kg: number;
  situation: 'premium' | 'discount' | 'neutral';
  months_to_dilute: number;
};

const ARROBA_KG = 15;

export function calculatePremium(inputs: PremiumInputs): PremiumResults {
  const {
    current_arroba_value,
    animal_paid_value,
    purchase_weight_kg,
    rearing_period_days,
  } = inputs;

  const paid_price_per_arroba = (animal_paid_value / purchase_weight_kg) * ARROBA_KG;

  const premium_discount_per_arroba = paid_price_per_arroba - current_arroba_value;

  const premium_discount_percentage =
    current_arroba_value > 0 ? (premium_discount_per_arroba / current_arroba_value) * 100 : 0;

  const total_premium_discount_per_animal = (premium_discount_per_arroba * purchase_weight_kg) / ARROBA_KG;

  const kg_per_arroba = current_arroba_value / ARROBA_KG;
  const additional_weight_needed_kg =
    kg_per_arroba > 0 ? Math.abs(premium_discount_per_arroba / kg_per_arroba) : 0;

  const daily_gain_needed_kg =
    rearing_period_days > 0 ? additional_weight_needed_kg / rearing_period_days : 0;

  const months_to_dilute = rearing_period_days / 30;

  let situation: 'premium' | 'discount' | 'neutral' = 'neutral';
  if (premium_discount_per_arroba > 0.5) {
    situation = 'premium';
  } else if (premium_discount_per_arroba < -0.5) {
    situation = 'discount';
  }

  return {
    paid_price_per_arroba,
    premium_discount_per_arroba,
    premium_discount_percentage,
    total_premium_discount_per_animal,
    additional_weight_needed_kg,
    daily_gain_needed_kg,
    situation,
    months_to_dilute,
  };
}
