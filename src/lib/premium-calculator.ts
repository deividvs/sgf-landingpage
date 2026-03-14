export type PremiumInputs = {
  current_arroba_value: number;
  animal_paid_value: number;
  purchase_weight_kg: number;
  rearing_period_days: number;
};

export type PremiumResults = {
  arrobas_at_purchase: number;
  cost_per_kg: number;
  paid_price_per_arroba: number;
  premium_discount_per_arroba: number;
  premium_discount_percentage: number;
  total_premium_discount_per_animal: number;
  daily_premium_to_dilute: number;
  daily_gain_needed_kg: number;
  additional_weight_needed_kg: number;
  situation: 'premium' | 'discount' | 'neutral';
  months_to_dilute: number;
};

const KG_PER_ARROBA = 30;

export function calculatePremium(inputs: PremiumInputs): PremiumResults {
  const {
    current_arroba_value,
    animal_paid_value,
    purchase_weight_kg,
    rearing_period_days,
  } = inputs;

  const arrobas_at_purchase = purchase_weight_kg / KG_PER_ARROBA;

  const cost_per_kg = animal_paid_value / purchase_weight_kg;

  const paid_price_per_arroba = cost_per_kg * KG_PER_ARROBA;

  const premium_discount_per_arroba = paid_price_per_arroba - current_arroba_value;

  const premium_discount_percentage =
    current_arroba_value > 0 ? (premium_discount_per_arroba / current_arroba_value) * 100 : 0;

  const total_premium_discount_per_animal = premium_discount_per_arroba * arrobas_at_purchase;

  const daily_premium_to_dilute =
    rearing_period_days > 0 ? Math.abs(total_premium_discount_per_animal) / rearing_period_days : 0;

  const daily_gain_needed_kg = cost_per_kg > 0 ? daily_premium_to_dilute / cost_per_kg : 0;

  const additional_weight_needed_kg = daily_gain_needed_kg * rearing_period_days;

  const months_to_dilute = rearing_period_days / 30;

  let situation: 'premium' | 'discount' | 'neutral' = 'neutral';
  if (premium_discount_per_arroba > 0.5) {
    situation = 'premium';
  } else if (premium_discount_per_arroba < -0.5) {
    situation = 'discount';
  }

  return {
    arrobas_at_purchase,
    cost_per_kg,
    paid_price_per_arroba,
    premium_discount_per_arroba,
    premium_discount_percentage,
    total_premium_discount_per_animal,
    daily_premium_to_dilute,
    daily_gain_needed_kg,
    additional_weight_needed_kg,
    situation,
    months_to_dilute,
  };
}
