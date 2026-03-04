import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Simulation } from '../../lib/supabase';
import { SimulationInputs, SimulationResults } from '../../lib/calculations';
import { SimulationWizard } from '../Simulation/SimulationWizard';
import { SimulationList } from './SimulationList';
import { SimulationDetails } from './SimulationDetails';
import { PremiumCalculator } from '../Premium/PremiumCalculator';
import { SupplementationCalculator } from '../Supplementation/SupplementationCalculator';
import { StockingRateCalculator } from '../StockingRate/StockingRateCalculator';
import { DailyCostCalculator } from '../DailyCost/DailyCostCalculator';
import { AnnualResultsCalculator } from '../AnnualResults/AnnualResultsCalculator';
import { BreakevenCalculator } from '../Breakeven/BreakevenCalculator';
import { SupplementationCochoCalculator } from '../SupplementationCocho/SupplementationCochoCalculator';
import { ProductionCostCalculator } from '../ProductionCost/ProductionCostCalculator';
import PurchaseCalculator from '../Purchase/PurchaseCalculator';
import { LogOut, Plus, List, Calculator, TrendingUp, Package, MapPin, DollarSign, Search, Filter, Star, Grid3x3, FileBarChart, Scale, PackageOpen, Target, ShoppingCart, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type AppSection = 'home' | 'simulations' | 'premium' | 'supplementation' | 'stocking_rate' | 'daily_cost' | 'annual_results' | 'breakeven' | 'supplementation_cocho' | 'production_cost' | 'purchase';
type FilterType = 'all' | 'favorites' | 'recent';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-72 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -top-2 left-full ml-2 transform -translate-y-1/2">
          <div className="relative">
            {content}
            <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-4 top-1/2 -translate-y-1/2"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

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

      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            <button
              onClick={() => setActiveSection('home')}
              title="Ferramentas"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'home'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setActiveSection('simulations');
                setView('list');
              }}
              title="Simulador de Resultados"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'simulations'
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('premium')}
              title="Diluir Ágio"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'premium'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Calculator className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('supplementation')}
              title="Suplementação"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'supplementation'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Package className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('stocking_rate')}
              title="Taxa de Lotação"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'stocking_rate'
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <MapPin className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('daily_cost')}
              title="Cálculo da Diária"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'daily_cost'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <DollarSign className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('annual_results')}
              title="Apuração de Resultados Anuais"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'annual_results'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <FileBarChart className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('breakeven')}
              title="Ponto de Equilíbrio da Arroba"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'breakeven'
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Scale className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('supplementation_cocho')}
              title="Suplementação no Cocho"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'supplementation_cocho'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <PackageOpen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('production_cost')}
              title="Custo de Produção PRO"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'production_cost'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Target className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveSection('purchase')}
              title="Simulação de Compra"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'purchase'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'home' ? (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Ferramentas</h1>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar ferramentas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-5 h-5" />
                  <span className="sm:inline">Filtros</span>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeFilter === 'all'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setActiveFilter('favorites')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeFilter === 'favorites'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Favoritas
              </button>
              <button
                onClick={() => setActiveFilter('recent')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                  activeFilter === 'recent'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Recentes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => {
                     setActiveSection('simulations');
                     setView('list');
                   }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use quando quiser projetar o resultado financeiro completo de um lote, incluindo receitas, custos operacionais, margem de lucro e tempo até a venda.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Simulador de Resultados</h3>
                <p className="text-sm text-gray-600 mb-4">Simule resultados financeiros da sua operação pecuária com base em custos e receitas</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">Popular</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('premium')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Calculator className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use quando comprar animais pagando um preço acima do mercado (ágio) e quiser saber quanto tempo levará para diluir esse custo extra com o ganho de peso.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Diluir Ágio</h3>
                <p className="text-sm text-gray-600 mb-4">Calcule quantos dias são necessários para diluir o ágio pago na compra de animais</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">v1.0</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('supplementation')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                    <Package className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use quando precisar calcular a quantidade exata de suplemento mineral ou proteico necessária diariamente para seu rebanho, baseado no peso dos animais e percentual de fornecimento.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cálculo de Suplementação</h3>
                <p className="text-sm text-gray-600 mb-4">Determine a quantidade exata de suplemento necessária para seu rebanho diáriamente</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">Novo</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('stocking_rate')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <MapPin className="w-6 h-6 text-teal-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use quando quiser calcular quantas cabeças de gado sua propriedade suporta ou qual a taxa de ocupação atual (UA/ha), considerando área disponível e peso dos animais.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Taxa de Lotação</h3>
                <p className="text-sm text-gray-600 mb-4">Calcule a taxa de lotação e otimize o uso da sua pastagem</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded">v1.0</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('daily_cost')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <DollarSign className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use quando quiser saber o custo diário por cabeça e por arroba produzida, considerando todos os gastos operacionais mensais divididos pelo ganho de peso.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cálculo da Diária</h3>
                <p className="text-sm text-gray-600 mb-4">Calcule custos operacionais mensais e margem de lucro por arroba produzida</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">Popular</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('annual_results')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <FileBarChart className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use para fazer o fechamento anual da propriedade, consolidando todas as vendas, compras, nascimentos, mortes e custos operacionais para análise de rentabilidade do negócio.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Apuração de Resultados Anuais</h3>
                <p className="text-sm text-gray-600 mb-4">Consolide receitas, custos e despesas anuais com análise de rentabilidade</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">Novo</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('breakeven')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                    <Scale className="w-6 h-6 text-sky-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use quando quiser descobrir qual o preço mínimo da arroba que você precisa vender para cobrir todos os custos e não ter prejuízo na operação.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ponto de Equilíbrio</h3>
                <p className="text-sm text-gray-600 mb-4">Calcule o preço mínimo da arroba para não ter prejuízo</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-medium rounded">Novo</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('supplementation_cocho')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                    <PackageOpen className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use para calcular a quantidade de ração ou suplemento concentrado fornecido no cocho, com base no consumo diário em kg por cabeça e quantidade de animais.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Suplementação no Cocho</h3>
                <p className="text-sm text-gray-600 mb-4">Calcule a quantidade exata de suplemento diário necessário</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">Novo</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('production_cost')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <Target className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use quando quiser saber quanto custa produzir cada arroba de carne na sua propriedade, dividindo os custos mensais totais pelo ganho de peso esperado.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Custo de Produção PRO</h3>
                <p className="text-sm text-gray-600 mb-4">Descubra quanto custa produzir uma arroba com base em custos mensais e GMD</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Novo</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                   onClick={() => setActiveSection('purchase')}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <ShoppingCart className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Use quando estiver comparando ofertas de diferentes fornecedores de gado, para calcular e comparar o preço real por arroba considerando peso e valor total.">
                      <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                        <Info className="w-5 h-5" />
                      </button>
                    </Tooltip>
                    <button className="text-gray-400 hover:text-yellow-500 transition-colors">
                      <Star className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Simulação de Compra</h3>
                <p className="text-sm text-gray-600 mb-4">Compare fornecedores e encontre a melhor opção de compra de gado</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">Novo</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeSection === 'simulations' ? (
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
        ) : activeSection === 'supplementation' ? (
          <SupplementationCalculator />
        ) : activeSection === 'stocking_rate' ? (
          <StockingRateCalculator />
        ) : activeSection === 'daily_cost' ? (
          <DailyCostCalculator />
        ) : activeSection === 'annual_results' ? (
          <AnnualResultsCalculator />
        ) : activeSection === 'breakeven' ? (
          <BreakevenCalculator />
        ) : activeSection === 'supplementation_cocho' ? (
          <SupplementationCochoCalculator />
        ) : activeSection === 'production_cost' ? (
          <ProductionCostCalculator />
        ) : activeSection === 'purchase' ? (
          <PurchaseCalculator onBack={() => setActiveSection('home')} />
        ) : null}
      </main>
    </div>
  );
}
