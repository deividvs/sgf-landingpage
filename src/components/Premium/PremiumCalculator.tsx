import { useState } from 'react';
import { PremiumInputs, PremiumResults } from '../../lib/premium-calculator';
import { PremiumForm } from './PremiumForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function PremiumCalculator() {
  const { user } = useAuth();
  const [currentInputs, setCurrentInputs] = useState<PremiumInputs | null>(null);
  const [currentResults, setCurrentResults] = useState<PremiumResults | null>(null);

  const handleCalculate = (inputs: PremiumInputs, results: PremiumResults) => {
    setCurrentInputs(inputs);
    setCurrentResults(results);
  };

  const handleSave = async (inputs: PremiumInputs, results: PremiumResults) => {
    if (!user) return;

    const { error } = await supabase.from('premium_simulations').insert({
      user_id: user.id,
      current_arroba_value: inputs.current_arroba_value,
      animal_paid_value: inputs.animal_paid_value,
      purchase_weight_kg: inputs.purchase_weight_kg,
      rearing_period_days: inputs.rearing_period_days,
      arrobas_at_purchase: results.arrobas_at_purchase,
      cost_per_kg: results.cost_per_kg,
      paid_price_per_arroba: results.paid_price_per_arroba,
      premium_discount_per_arroba: results.premium_discount_per_arroba,
      premium_discount_percentage: results.premium_discount_percentage,
      total_premium_discount_per_animal: results.total_premium_discount_per_animal,
      daily_premium_to_dilute: results.daily_premium_to_dilute,
      daily_gain_needed_kg: results.daily_gain_needed_kg,
      situation: results.situation,
    });

    if (!error) {
      alert('Simulação salva com sucesso!');
    } else {
      alert('Erro ao salvar simulação. Tente novamente.');
    }
  };

  return (
    <div>
      <PremiumForm onCalculate={handleCalculate} onSave={handleSave} />
    </div>
  );
}
