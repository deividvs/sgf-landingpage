import { Simulation } from '../../lib/supabase';
import { SimulationInputs, calculateSimulation } from '../../lib/calculations';
import { ResultsView } from '../Simulation/ResultsView';
import { ArrowLeft } from 'lucide-react';

type Props = {
  simulation: Simulation;
  onBack: () => void;
};

export function SimulationDetails({ simulation, onBack }: Props) {
  const inputs: SimulationInputs = {
    herd_description: simulation.herd_description,
    quantity: simulation.quantity,
    initial_weight: simulation.initial_weight,
    final_weight: simulation.final_weight,
    carcass_yield_percentage: simulation.carcass_yield_percentage ?? 52,
    acquisition_value_per_kg: simulation.acquisition_value_per_kg,
    average_daily_gain: simulation.average_daily_gain,
    lease_monthly_per_head: simulation.lease_monthly_per_head,
    workers_count: simulation.workers_count,
    labor_monthly_per_worker: simulation.labor_monthly_per_worker,
    supplement_bag_price: simulation.supplement_bag_price,
    supplement_bag_weight: simulation.supplement_bag_weight,
    supplement_percentage: simulation.supplement_percentage,
    supplement_daily_consumption: simulation.supplement_daily_consumption,
    other_expenses_monthly_per_head: simulation.other_expenses_monthly_per_head,
    arroba_value: simulation.arroba_value,
  };

  // Recalculate all results from inputs to ensure all fields are present,
  // including carcass fields that were missing from older saved records.
  const results = calculateSimulation(inputs);

  const handleNewSimulation = () => {
    onBack();
  };

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para Minhas Simulações
      </button>
      <ResultsView
        inputs={inputs}
        results={results}
        onNewSimulation={handleNewSimulation}
        onSave={async () => { return; }}
        showSaveButton={false}
      />
    </div>
  );
}
