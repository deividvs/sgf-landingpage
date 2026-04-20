import { useState } from 'react';
import { StockingRateInputs, StockingRateResults } from '../../lib/stocking-rate-calculator';
import { generateStockingRatePDF } from '../../lib/stocking-rate-pdf-generator';
import { StockingRateForm } from './StockingRateForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function StockingRateCalculator() {
  const { user } = useAuth();
  const [currentInputs, setCurrentInputs] = useState<StockingRateInputs | null>(null);
  const [currentResults, setCurrentResults] = useState<StockingRateResults | null>(null);

  const handleCalculate = (inputs: StockingRateInputs, results: StockingRateResults) => {
    setCurrentInputs(inputs);
    setCurrentResults(results);
  };

  const handleSave = async (inputs: StockingRateInputs, results: StockingRateResults) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('stocking_rate_simulations').insert({
        user_id: user.id,
        area_ha: inputs.area_ha,
        animal_quantity: inputs.animal_quantity,
        average_weight_kg: inputs.average_weight_kg,
        total_weight_kg: results.total_weight_kg,
        total_animal_units: results.total_animal_units,
        stocking_rate_ua_ha: results.stocking_rate_ua_ha,
        classification: results.classification,
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

  const handleExportPDF = (inputs: StockingRateInputs, results: StockingRateResults) => {
    generateStockingRatePDF(inputs, results);
  };

  return (
    <div>
      <StockingRateForm
        onCalculate={handleCalculate}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
      />
    </div>
  );
}
