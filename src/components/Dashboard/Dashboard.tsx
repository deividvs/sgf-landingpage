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
import { ProductionCostCalculator } from '../ProductionCost/ProductionCostCalculator';
import PurchaseCalculator from '../Purchase/PurchaseCalculator';
import { CarcassYieldCalculator } from '../CarcassYield/CarcassYieldCalculator';
import { LogOut, Plus, List, Calculator, TrendingUp, Package, MapPin, DollarSign, Search, Star, Grid3x3, FileBarChart, Scale, Target, ShoppingCart, Beef, Menu, User, Settings, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SubscriptionBadge } from '../Subscription/SubscriptionBadge';
import { SessionInfo } from './SessionInfo';

type AppSection = 'home' | 'simulations' | 'premium' | 'supplementation' | 'stocking_rate' | 'daily_cost' | 'annual_results' | 'breakeven' | 'production_cost' | 'purchase' | 'carcass_yield';
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
    name: 'Fechamento de Lote',
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
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    loadSimulations();
    loadFavoriteTools();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentDateTime.getHours();
    if (hour >= 6 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getFormattedDateTime = () => {
    const time = currentDateTime.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const date = currentDateTime.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    return `agora são ${time} de ${date}`;
  };

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
    try {
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
      } else {
        alert('Erro ao salvar simulação. Tente novamente.');
      }
    } catch (err) {
      alert('Erro ao salvar simulação. Tente novamente.');
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

  const getUserInitials = () => {
    const email = user?.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  const ToolNavigationSheet = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Ferramentas</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
          <div className="space-y-1">
            {ALL_TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveSection(tool.section);
                  if (tool.section === 'simulations') {
                    setView('list');
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeSection === tool.section
                    ? 'bg-green-100 text-green-900'
                    : 'hover:bg-gray-100'
                }`}
              >
                {getToolIcon(tool.id)}
                <span className="text-sm font-medium">{tool.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <ToolNavigationSheet />
              <div className="flex items-center gap-3">
                <img
                  src="/Untitled_design_(1).jpg"
                  alt="SGF Logo"
                  className="w-10 h-10 object-contain"
                />
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-gray-900">Gestão de Fazenda</h1>
                  <p className="text-xs text-gray-500">{getGreeting()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SubscriptionBadge />

              {activeSection === 'simulations' && view === 'list' && (
                <Button onClick={() => setView('create')} size="sm" className="hidden sm:flex">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Simulação
                </Button>
              )}
              {activeSection === 'simulations' && view === 'create' && (
                <Button onClick={() => setView('list')} size="sm" variant="outline" className="hidden sm:flex">
                  <List className="w-4 h-4 mr-2" />
                  Minhas Simulações
                </Button>
              )}

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
              </Button>

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
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
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

        <Separator />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollArea className="w-full">
            <div className="flex gap-2 py-3">
              <Button
                onClick={() => setActiveSection('home')}
                variant={activeSection === 'home' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Todas as Ferramentas"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => {
                  setActiveSection('simulations');
                  setView('list');
                }}
                variant={activeSection === 'simulations' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Simulador de Resultados"
              >
                <TrendingUp className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('premium')}
                variant={activeSection === 'premium' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Diluir Ágio"
              >
                <Calculator className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('supplementation')}
                variant={activeSection === 'supplementation' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Cálculo de Suplementação"
              >
                <Package className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('stocking_rate')}
                variant={activeSection === 'stocking_rate' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Taxa de Lotação"
              >
                <MapPin className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('daily_cost')}
                variant={activeSection === 'daily_cost' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Cálculo da Diária"
              >
                <DollarSign className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('annual_results')}
                variant={activeSection === 'annual_results' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Apuração de Resultados Anuais"
              >
                <FileBarChart className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('breakeven')}
                variant={activeSection === 'breakeven' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Ponto de Equilíbrio"
              >
                <Scale className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('production_cost')}
                variant={activeSection === 'production_cost' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Custo de Produção PRO"
              >
                <Target className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('purchase')}
                variant={activeSection === 'purchase' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Simulação de Compra"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setActiveSection('carcass_yield')}
                variant={activeSection === 'carcass_yield' ? 'default' : 'ghost'}
                size="icon"
                className="hidden md:flex"
                title="Fechamento de Lote"
              >
                <Beef className="w-4 h-4" />
              </Button>
            </div>
          </ScrollArea>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'home' ? (
          <div className="space-y-8">
            <SessionInfo />
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ferramentas de Gestão</h1>
                <p className="text-gray-600">Escolha uma ferramenta para começar sua análise</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Buscar ferramentas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <Tabs value={activeFilter} onValueChange={(value) => setActiveFilter(value as FilterType)} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="favorites">Favoritas</TabsTrigger>
                <TabsTrigger value="recent">Recentes</TabsTrigger>
              </TabsList>
            </Tabs>

            {getFilteredTools().length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeFilter === 'favorites' ? 'Nenhuma ferramenta favoritada' : 'Nenhuma ferramenta encontrada'}
                  </h3>
                  <p className="text-gray-600 text-center max-w-md">
                    {activeFilter === 'favorites'
                      ? 'Clique na estrela das ferramentas para adicioná-las aos favoritos'
                      : 'Tente ajustar sua busca ou filtros'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFilteredTools().map((tool) => {
                  const colors = getToolColors(tool.id);
                  return (
                    <Card
                      key={tool.id}
                      className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-2 hover:border-green-200"
                      onClick={() => {
                        setActiveSection(tool.section);
                        if (tool.section === 'simulations') {
                          setView('list');
                        }
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center transition-all duration-200 ${colors.hover} shadow-sm`}>
                            <div className={colors.icon}>
                              {getToolIcon(tool.id)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mt-1 -mr-1"
                            onClick={(e) => toggleFavorite(tool.id, e)}
                          >
                            <Star
                              className={`w-5 h-5 transition-colors ${
                                favoritedTools.has(tool.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'
                              }`}
                            />
                          </Button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition-colors">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {tool.description}
                        </p>
                        {tool.badge && (
                          <Badge variant="secondary" className={getBadgeColors(tool.badge.color)}>
                            {tool.badge.text}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
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
