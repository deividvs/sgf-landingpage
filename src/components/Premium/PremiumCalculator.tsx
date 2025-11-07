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

  const handleSave = async () => {
    if (!currentInputs || !currentResults || !user) return;

    const { error } = await supabase.from('premium_simulations').insert({
      user_id: user.id,
      current_arroba_value: currentInputs.current_arroba_value,
      animal_paid_value: currentInputs.animal_paid_value,
      purchase_weight_kg: currentInputs.purchase_weight_kg,
      rearing_period_days: currentInputs.rearing_period_days,
      arrobas_at_purchase: currentResults.arrobas_at_purchase,
      cost_per_kg: currentResults.cost_per_kg,
      paid_price_per_arroba: currentResults.paid_price_per_arroba,
      premium_discount_per_arroba: currentResults.premium_discount_per_arroba,
      premium_discount_percentage: currentResults.premium_discount_percentage,
      total_premium_discount_per_animal: currentResults.total_premium_discount_per_animal,
      daily_premium_to_dilute: currentResults.daily_premium_to_dilute,
      daily_gain_needed_kg: currentResults.daily_gain_needed_kg,
      situation: currentResults.situation,
    });

    if (!error) {
      alert('Simulação salva com sucesso!');
    }
  };

  return (
    <div>
      <PremiumForm onCalculate={handleCalculate} />
      {currentResults && (
        <div className="max-w-4xl mx-auto mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Salvar Simulação
          </button>
        </div>
      )}
    </div>
  );
}
