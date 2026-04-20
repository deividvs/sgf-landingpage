import { Simulation } from '../../lib/supabase';
import { SimulationInputs, SimulationResults } from '../../lib/calculations';
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

  const results: SimulationResults = {
    weight_to_gain: simulation.weight_to_gain,
    months_to_sell: simulation.months_to_sell,
    total_revenue: simulation.total_revenue,
    acquisition_costs: simulation.acquisition_costs || 0,
    lease_costs: simulation.lease_costs || 0,
    labor_costs: simulation.labor_costs || 0,
    supplement_costs: simulation.supplement_costs || 0,
    other_costs: simulation.other_costs || 0,
    total_expenses: simulation.total_expenses,
    profit_margin_percentage: simulation.profit_margin_percentage,
    result_per_animal: simulation.result_per_animal,
    cost_per_arroba: simulation.cost_per_arroba,
    monthly_lease_cost: simulation.lease_monthly_per_head,
    monthly_labor_cost: inputs.quantity > 0 ? (simulation.labor_monthly_per_worker * simulation.workers_count) / inputs.quantity : 0,
    monthly_supplement_cost: simulation.supplement_daily_consumption * (simulation.supplement_bag_price / simulation.supplement_bag_weight) * 30,
    monthly_other_cost: simulation.other_expenses_monthly_per_head,
    monthly_cost_total: 0,
  };

  results.monthly_cost_total =
    results.monthly_lease_cost +
    results.monthly_labor_cost +
    results.monthly_supplement_cost +
    results.monthly_other_cost;

  const handleSave = async () => {
    return;
  };

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
        onSave={handleSave}
        showSaveButton={false}
      />
    </div>
  );
}
