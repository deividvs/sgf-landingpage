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
import { CarcassYieldCalculator } from '../CarcassYield/CarcassYieldCalculator';
import { LogOut, Plus, List, Calculator, TrendingUp, Package, MapPin, DollarSign, Search, Filter, Star, Grid3x3, FileBarChart, Scale, PackageOpen, Target, ShoppingCart, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
type AppSection = 'home' | 'simulations' | 'premium' | 'supplementation' | 'stocking_rate' | 'daily_cost' | 'annual_results' | 'breakeven' | 'supplementation_cocho' | 'production_cost' | 'purchase' | 'carcass_yield';
type FilterType = 'all' | 'favorites' | 'recent';

interface Tool {
  id: string;
  name: string;
  description: string;
  section: AppSection;
  badge?: { text: string; color: string };
}

const ALL_TOOLS: Tool[] = [
  {
    id: 'simulations',
    name: 'Simulador de Resultados',
    description: 'Simule resultados financeiros da sua operação pecuária com base em custos e receitas',
    section: 'simulations',
    badge: { text: 'Popular', color: 'green' }
  },
  {
    id: 'premium',
    name: 'Diluir Ágio',
    description: 'Calcule quantos dias são necessários para diluir o ágio pago na compra de animais',
    section: 'premium',
    badge: { text: 'v1.0', color: 'gray' }
  },
  {
    id: 'supplementation',
    name: 'Cálculo de Suplementação',
    description: 'Determine a quantidade exata de suplemento necessária para seu rebanho diáriamente',
    section: 'supplementation',
    badge: { text: 'Novo', color: 'amber' }
  },
  {
    id: 'stocking_rate',
    name: 'Taxa de Lotação',
    description: 'Calcule a taxa de lotação e otimize o uso da sua pastagem',
    section: 'stocking_rate',
    badge: { text: 'v1.0', color: 'teal' }
  },
  {
    id: 'daily_cost',
    name: 'Cálculo da Diária',
    description: 'Calcule custos operacionais mensais e margem de lucro por arroba produzida',
    section: 'daily_cost',
    badge: { text: 'Popular', color: 'emerald' }
  },
  {
    id: 'annual_results',
    name: 'Apuração de Resultados Anuais',
    description: 'Consolide receitas, custos e despesas anuais com análise de rentabilidade',
    section: 'annual_results',
    badge: { text: 'Novo', color: 'purple' }
  },
  {
    id: 'breakeven',
    name: 'Ponto de Equilíbrio',
    description: 'Calcule o preço mínimo da arroba para não ter prejuízo',
    section: 'breakeven',
    badge: { text: 'Novo', color: 'sky' }
  },
  {
    id: 'supplementation_cocho',
    name: 'Suplementação no Cocho',
    description: 'Calcule a quantidade exata de suplemento diário necessário',
    section: 'supplementation_cocho',
    badge: { text: 'Novo', color: 'orange' }
  },
  {
    id: 'production_cost',
    name: 'Custo de Produção PRO',
    description: 'Descubra quanto custa produzir uma arroba com base em custos mensais e GMD',
    section: 'production_cost',
    badge: { text: 'Novo', color: 'red' }
  },
  {
    id: 'purchase',
    name: 'Simulação de Compra',
    description: 'Compare fornecedores e encontre a melhor opção de compra de gado',
    section: 'purchase',
    badge: { text: 'Novo', color: 'indigo' }
  },
  {
    id: 'carcass_yield',
    name: 'Rendimento de Carcaça',
    description: 'Calcule o rendimento de carcaça e receita estimada da venda de animais',
    section: 'carcass_yield',
    badge: { text: 'Novo', color: 'rose' }
  }
];

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState<AppSection>('home');
  const [view, setView] = useState<'list' | 'create' | 'details'>('list');
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [favoritedTools, setFavoritedTools] = useState<Set<string>>(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    loadSimulations();
    loadFavoriteTools();
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

  const loadFavoriteTools = async () => {
    if (!user) return;

    setLoadingFavorites(true);
    try {
      const { data, error } = await supabase
        .from('user_tool_favorites')
        .select('tool_id')
        .eq('user_id', user.id);

      if (!error && data) {
        setFavoritedTools(new Set(data.map(item => item.tool_id)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const toggleFavorite = async (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user) return;

    const isFavorited = favoritedTools.has(toolId);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('user_tool_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('tool_id', toolId);

        if (!error) {
          setFavoritedTools(prev => {
            const newSet = new Set(prev);
            newSet.delete(toolId);
            return newSet;
          });
        }
      } else {
        const { error } = await supabase
          .from('user_tool_favorites')
          .insert({
            user_id: user.id,
            tool_id: toolId
          });

        if (!error) {
          setFavoritedTools(prev => new Set(prev).add(toolId));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const getFilteredTools = (): Tool[] => {
    let filtered = ALL_TOOLS;

    if (activeFilter === 'favorites') {
      filtered = filtered.filter(tool => favoritedTools.has(tool.id));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const getToolIcon = (toolId: string) => {
    const iconProps = { className: "w-6 h-6" };
    const icons: Record<string, JSX.Element> = {
      simulations: <TrendingUp {...iconProps} />,
      premium: <Calculator {...iconProps} />,
      supplementation: <Package {...iconProps} />,
      stocking_rate: <MapPin {...iconProps} />,
      daily_cost: <DollarSign {...iconProps} />,
      annual_results: <FileBarChart {...iconProps} />,
      breakeven: <Scale {...iconProps} />,
      supplementation_cocho: <PackageOpen {...iconProps} />,
      production_cost: <Target {...iconProps} />,
      purchase: <ShoppingCart {...iconProps} />,
      carcass_yield: <Beef {...iconProps} />
    };
    return icons[toolId] || <Grid3x3 {...iconProps} />;
  };

  const getToolColors = (toolId: string) => {
    const colors: Record<string, { bg: string; hover: string; icon: string }> = {
      simulations: { bg: 'bg-green-100', hover: 'group-hover:bg-green-200', icon: 'text-green-600' },
      premium: { bg: 'bg-blue-100', hover: 'group-hover:bg-blue-200', icon: 'text-blue-600' },
      supplementation: { bg: 'bg-amber-100', hover: 'group-hover:bg-amber-200', icon: 'text-amber-600' },
      stocking_rate: { bg: 'bg-teal-100', hover: 'group-hover:bg-teal-200', icon: 'text-teal-600' },
      daily_cost: { bg: 'bg-emerald-100', hover: 'group-hover:bg-emerald-200', icon: 'text-emerald-600' },
      annual_results: { bg: 'bg-purple-100', hover: 'group-hover:bg-purple-200', icon: 'text-purple-600' },
      breakeven: { bg: 'bg-sky-100', hover: 'group-hover:bg-sky-200', icon: 'text-sky-600' },
      supplementation_cocho: { bg: 'bg-orange-100', hover: 'group-hover:bg-orange-200', icon: 'text-orange-600' },
      production_cost: { bg: 'bg-red-100', hover: 'group-hover:bg-red-200', icon: 'text-red-600' },
      purchase: { bg: 'bg-indigo-100', hover: 'group-hover:bg-indigo-200', icon: 'text-indigo-600' },
      carcass_yield: { bg: 'bg-rose-100', hover: 'group-hover:bg-rose-200', icon: 'text-rose-600' }
    };
    return colors[toolId] || { bg: 'bg-gray-100', hover: 'group-hover:bg-gray-200', icon: 'text-gray-600' };
  };

  const getBadgeColors = (color: string) => {
    const badgeColors: Record<string, string> = {
      green: 'bg-green-100 text-green-700',
      gray: 'bg-gray-100 text-gray-700',
      amber: 'bg-amber-100 text-amber-700',
      teal: 'bg-teal-100 text-teal-700',
      emerald: 'bg-emerald-100 text-emerald-700',
      purple: 'bg-purple-100 text-purple-700',
      sky: 'bg-sky-100 text-sky-700',
      orange: 'bg-orange-100 text-orange-700',
      red: 'bg-red-100 text-red-700',
      indigo: 'bg-indigo-100 text-indigo-700',
      rose: 'bg-rose-100 text-rose-700'
    };
    return badgeColors[color] || 'bg-gray-100 text-gray-700';
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
                <h1 className="text-xl font-bold text-gray-800">Sistema Gestão de Fazenda</h1>
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
            <button
              onClick={() => setActiveSection('carcass_yield')}
              title="Rendimento de Carcaça"
              className={`flex items-center justify-center w-11 h-11 rounded-lg transition-all ${
                activeSection === 'carcass_yield'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              <Beef className="w-5 h-5" />
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

            {getFilteredTools().length === 0 ? (
              <div className="text-center py-16">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {activeFilter === 'favorites' ? 'Nenhuma ferramenta favoritada' : 'Nenhuma ferramenta encontrada'}
                </h3>
                <p className="text-gray-500">
                  {activeFilter === 'favorites'
                    ? 'Clique na estrela das ferramentas para adicioná-las aos favoritos'
                    : 'Tente ajustar sua busca ou filtros'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredTools().map((tool) => {
                  const colors = getToolColors(tool.id);
                  return (
                    <div
                      key={tool.id}
                      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => {
                        setActiveSection(tool.section);
                        if (tool.section === 'simulations') {
                          setView('list');
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center ${colors.hover} transition-colors`}>
                          <div className={colors.icon}>
                            {getToolIcon(tool.id)}
                          </div>
                        </div>
                        <button
                          onClick={(e) => toggleFavorite(tool.id, e)}
                          className={`transition-colors ${favoritedTools.has(tool.id) ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                        >
                          <Star className="w-5 h-5" fill={favoritedTools.has(tool.id) ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{tool.description}</p>
                      {tool.badge && (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 ${getBadgeColors(tool.badge.color)} text-xs font-medium rounded`}>
                            {tool.badge.text}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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
        ) : activeSection === 'carcass_yield' ? (
          <CarcassYieldCalculator />
        ) : null}
      </main>
    </div>
  );
}
