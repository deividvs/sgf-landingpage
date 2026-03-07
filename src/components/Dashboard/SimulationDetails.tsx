import { Simulation } from '../../lib/localStorage';
import { SimulationInputs, SimulationResults } from '../../lib/calculations';
import { ResultsView } from '../Simulation/ResultsView';
import { ArrowLeft } from 'lucide-react';

type Props = {
  simulation: Simulation;
  onBack: () => void;
};

export function SimulationDetails({ simulation, onBack }: Props) {
  const monthsToSell = simulation.feeding_days / 30;
  const weightToGain = simulation.final_weight - simulation.initial_weight;

  const inputs: SimulationInputs = {
    herd_description: simulation.title,
    quantity: simulation.quantity,
    initial_weight: simulation.initial_weight,
    final_weight: simulation.final_weight,
    acquisition_value_per_kg: 0,
    average_daily_gain: weightToGain / simulation.feeding_days,
    lease_monthly_per_head: simulation.lease_per_animal,
    workers_count: simulation.workers,
    labor_monthly_per_worker: simulation.labor_cost_per_worker,
    supplement_bag_price: simulation.supplement_cost,
    supplement_bag_weight: 25,
    supplement_percentage: 1,
    supplement_daily_consumption: simulation.supplement_consumption_per_day,
    other_expenses_monthly_per_head: simulation.other_expenses,
    arroba_value: simulation.arroba_value,
  };

  const monthlyLeaseCost = simulation.lease_per_animal;
  const monthlyLaborCost = inputs.quantity > 0 ? (simulation.labor_cost_per_worker * simulation.workers) / inputs.quantity : 0;
  const monthlySupplementCost = simulation.supplement_consumption_per_day * (simulation.supplement_cost / 25) * 30;
  const monthlyOtherCost = simulation.other_expenses;

  const results: SimulationResults = {
    weight_to_gain: weightToGain,
    months_to_sell: monthsToSell,
    total_revenue: simulation.total_revenue,
    acquisition_costs: 0,
    lease_costs: monthlyLeaseCost * monthsToSell * simulation.quantity,
    labor_costs: simulation.labor_cost_per_worker * simulation.workers * monthsToSell,
    supplement_costs: monthlySupplementCost * monthsToSell * simulation.quantity,
    other_costs: monthlyOtherCost * monthsToSell * simulation.quantity,
    total_expenses: simulation.total_expenses,
    profit_margin_percentage: simulation.profit_margin_percentage,
    result_per_animal: simulation.result_per_animal,
    cost_per_arroba: simulation.total_expenses / ((simulation.final_weight / 15) * simulation.quantity),
    monthly_lease_cost: monthlyLeaseCost,
    monthly_labor_cost: monthlyLaborCost,
    monthly_supplement_cost: monthlySupplementCost,
    monthly_other_cost: monthlyOtherCost,
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
