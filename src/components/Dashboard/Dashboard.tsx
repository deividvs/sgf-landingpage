import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Simulation } from '../../lib/supabase';
import { SimulationInputs, SimulationResults } from '../../lib/calculations';
import { SimulationWizard } from '../Simulation/SimulationWizard';
import { SimulationList } from './SimulationList';
import { SimulationDetails } from './SimulationDetails';
import { PremiumCalculator } from '../Premium/PremiumCalculator';
import { LogOut, Plus, List, Calculator, TrendingUp } from 'lucide-react';

type AppSection = 'simulations' | 'premium';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<AppSection>('simulations');
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('simulations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSimulations(data);
    }
    setLoading(false);
  };

  const handleSaveSimulation = async (inputs: SimulationInputs, results: SimulationResults) => {
    const { error } = await supabase.from('simulations').insert({
      user_id: user!.id,
      title: inputs.herd_description,
      herd_description: inputs.herd_description,
      quantity: inputs.quantity,
      initial_weight: inputs.initial_weight,
      final_weight: inputs.final_weight,
      acquisition_value_per_kg: inputs.acquisition_value_per_kg,
      average_daily_gain: inputs.average_daily_gain,
      lease_monthly_per_head: inputs.lease_monthly_per_head,
      workers_count: inputs.workers_count,
      labor_monthly_per_worker: inputs.labor_monthly_per_worker,
      supplement_bag_price: inputs.supplement_bag_price,
      supplement_bag_weight: inputs.supplement_bag_weight,
      supplement_percentage: inputs.supplement_percentage,
      supplement_daily_consumption: inputs.supplement_daily_consumption,
      other_expenses_monthly_per_head: inputs.other_expenses_monthly_per_head,
      arroba_value: inputs.arroba_value,
      weight_to_gain: results.weight_to_gain,
      months_to_sell: results.months_to_sell,
      total_revenue: results.total_revenue,
      acquisition_costs: results.acquisition_costs,
      lease_costs: results.lease_costs,
      labor_costs: results.labor_costs,
      supplement_costs: results.supplement_costs,
      other_costs: results.other_costs,
      total_expenses: results.total_expenses,
      profit_margin_percentage: results.profit_margin_percentage,
      result_per_animal: results.result_per_animal,
      cost_per_arroba: results.cost_per_arroba,
    });

    if (!error) {
      await loadSimulations();
      setView('list');
    }
  };

  const handleViewSimulation = (simulation: Simulation) => {
    setSelectedSimulation(simulation);
    setView('details');
  };

  const handleDeleteSimulation = async (id: string) => {
    const { error } = await supabase.from('simulations').delete().eq('id', id);

    if (!error) {
      await loadSimulations();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Pecuária Simulador Pro</h1>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {activeSection === 'simulations' && view === 'list' && (
                <button
                  onClick={() => setView('create')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-5 h-5" />
                  Nova Simulação
                </button>
              )}
              {activeSection === 'simulations' && view === 'create' && (
                <button
                  onClick={() => setView('list')}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <List className="w-5 h-5" />
                  Minhas Simulações
                </button>
              )}
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1">
            <button
              onClick={() => {
                setActiveSection('simulations');
                setView('list');
              }}
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeSection === 'simulations'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Simulador de Resultados
            </button>
            <button
              onClick={() => setActiveSection('premium')}
              className={`flex items-center gap-2 px-6 py-3 font-medium border-b-2 transition-colors ${
                activeSection === 'premium'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="w-5 h-5" />
              Diluir Ágio
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'simulations' ? (
          <>
            {view === 'list' ? (
              <SimulationList
                simulations={simulations}
                loading={loading}
                onDelete={handleDeleteSimulation}
                onCreate={() => setView('create')}
                onView={handleViewSimulation}
              />
            ) : view === 'create' ? (
              <SimulationWizard onSave={handleSaveSimulation} />
            ) : view === 'details' && selectedSimulation ? (
              <SimulationDetails
                simulation={selectedSimulation}
                onBack={() => setView('list')}
              />
            ) : null}
          </>
        ) : activeSection === 'premium' ? (
          <PremiumCalculator />
        ) : null}
      </main>
    </div>
  );
}
