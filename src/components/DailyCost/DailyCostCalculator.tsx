import { useState } from 'react';
import { DailyCostInputs, DailyCostResults } from '../../lib/daily-cost-calculator';
import { generateDailyCostPDF } from '../../lib/daily-cost-pdf-generator';
import { DailyCostForm } from './DailyCostForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function DailyCostCalculator() {
  const { user } = useAuth();
  const [currentInputs, setCurrentInputs] = useState<DailyCostInputs | null>(null);
  const [currentResults, setCurrentResults] = useState<DailyCostResults | null>(null);

  const handleCalculate = (inputs: DailyCostInputs, results: DailyCostResults) => {
    setCurrentInputs(inputs);
    setCurrentResults(results);
  };

  const handleSave = async (inputs: DailyCostInputs, results: DailyCostResults) => {
    if (!user) return;

    const { error } = await supabase.from('daily_cost_simulations').insert({
      user_id: user.id,
      month: inputs.month,
      year: inputs.year,
      costs: inputs.costs,
      total_animals: inputs.total_animals,
      supplement_cost_per_kg: inputs.supplement_cost_per_kg,
      supplement_quantity_per_animal_day: inputs.supplement_quantity_per_animal_day,
      average_daily_gain_kg: inputs.average_daily_gain_kg,
      market_arroba_price: inputs.market_arroba_price,
      total_monthly_cost: results.total_monthly_cost,
      total_daily_cost: results.total_daily_cost,
      days_to_produce_arroba: results.days_to_produce_arroba,
      cost_per_arroba: results.cost_per_arroba,
      profit_per_arroba: results.profit_per_arroba,
      is_profitable: results.is_profitable,
    });

    if (!error) {
      alert('Simulação salva com sucesso!');
    } else {
      alert('Erro ao salvar simulação. Tente novamente.');
    }
  };

  const handleExportPDF = (inputs: DailyCostInputs, results: DailyCostResults) => {
    generateDailyCostPDF(inputs, results);
  };

  return (
    <div>
      <DailyCostForm
        onCalculate={handleCalculate}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
      />
    </div>
  );
}
