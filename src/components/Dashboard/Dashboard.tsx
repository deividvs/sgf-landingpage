import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { localStorageService, Simulation } from '../../lib/localStorage';
import { SimulationInputs, SimulationResults } from '../../lib/calculations';
import { SimulationWizard } from '../Simulation/SimulationWizard';
import { SimulationList } from './SimulationList';
import { SimulationDetails } from './SimulationDetails';
import { LogOut, Plus, List, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type View = 'list' | 'create' | 'details';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [view, setView] = useState<View>('list');
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    setLoading(true);
    if (user) {
      const data = localStorageService.simulations.getAll(user.id);
      setSimulations(data);
    }
    setLoading(false);
  };

  const handleSaveSimulation = async (inputs: SimulationInputs, results: SimulationResults) => {
    if (!user) return;

    localStorageService.simulations.create(user.id, {
      title: inputs.herd_description,
      quantity: inputs.quantity,
      initial_weight: inputs.initial_weight,
      final_weight: inputs.final_weight,
      feeding_days: results.months_to_sell * 30,
      arroba_value: inputs.arroba_value,
      lease_per_animal: inputs.lease_monthly_per_head,
      workers: inputs.workers_count,
      labor_cost_per_worker: inputs.labor_monthly_per_worker,
      supplement_cost: inputs.supplement_bag_price,
      supplement_quantity: results.supplement_costs / inputs.supplement_bag_price,
      supplement_period_days: results.months_to_sell * 30,
      supplement_consumption_per_day: inputs.supplement_daily_consumption,
      other_expenses: inputs.other_expenses_monthly_per_head,
      total_revenue: results.total_revenue,
      total_expenses: results.total_expenses,
      result_per_animal: results.result_per_animal,
      profit_margin_percentage: results.profit_margin_percentage,
    });

    await loadSimulations();
    setView('list');
  };

  const handleViewSimulation = (simulation: Simulation) => {
    setSelectedSimulation(simulation);
    setView('details');
  };

  const handleDeleteSimulation = async (id: string) => {
    localStorageService.simulations.delete(id);
    await loadSimulations();
  };

  const getUserInitials = () => {
    const email = user?.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Pecuária Simulador Pro</h1>
                <p className="text-xs text-gray-500">Gestão Inteligente de Pecuária</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {view === 'list' && (
                <Button onClick={() => setView('create')} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Simulação
                </Button>
              )}
              {view === 'create' && (
                <Button onClick={() => setView('list')} size="sm" variant="outline">
                  <List className="w-4 h-4 mr-2" />
                  Minhas Simulações
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Minha Conta</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>
    </div>
  );
}
