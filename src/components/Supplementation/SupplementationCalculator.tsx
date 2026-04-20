import { useState } from 'react';
import { SupplementationInputs, SupplementationResults } from '../../lib/supplementation-calculator';
import { generateSupplementationPDF } from '../../lib/supplementation-pdf-generator';
import { SupplementationForm } from './SupplementationForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function SupplementationCalculator() {
  const { user } = useAuth();
  const [currentInputs, setCurrentInputs] = useState<SupplementationInputs | null>(null);
  const [currentResults, setCurrentResults] = useState<SupplementationResults | null>(null);

  const handleCalculate = (inputs: SupplementationInputs, results: SupplementationResults) => {
    setCurrentInputs(inputs);
    setCurrentResults(results);
  };

  const handleSave = async (inputs: SupplementationInputs, results: SupplementationResults) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('supplementation_calculations').insert({
        user_id: user.id,
        quantity_heads: inputs.animal_quantity,
        average_weight_kg: inputs.average_weight_kg,
        supplementation_type: inputs.supplementation_type,
        consumption_percentage: inputs.consumption_percentage,
        bag_weight_kg: inputs.bag_weight_kg,
        daily_consumption_kg: results.daily_consumption_kg,
        bags_per_day: results.bags_per_day,
      });

      if (!error) {
        alert('Simulação salva com sucesso!');
      } else {
        alert('Erro ao salvar simulação. Tente novamente.');
      }
    } catch (err) {
      alert('Erro ao salvar simulação. Tente novamente.');
    }
  };

  const handleExportPDF = (inputs: SupplementationInputs, results: SupplementationResults) => {
    generateSupplementationPDF(inputs, results);
  };

  return (
    <div>
      <SupplementationForm
        onCalculate={handleCalculate}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
      />
    </div>
  );
}
