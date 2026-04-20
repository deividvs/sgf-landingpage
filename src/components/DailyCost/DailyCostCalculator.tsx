import { useState, useEffect } from 'react';
import { DailyCostInputs, DailyCostResults } from '../../lib/daily-cost-calculator';
import { generateDailyCostPDF } from '../../lib/daily-cost-pdf-generator';
import { DailyCostForm } from './DailyCostForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, Plus, List, Trash2 } from 'lucide-react';
import { CalculatorLayout } from '../Layout/CalculatorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface SavedSimulation {
  id: string;
  month: string;
  year: number;
  total_animals: number;
  cost_per_arroba: number;
  profit_per_arroba: number;
  is_profitable: boolean;
  created_at: string;
}

export function DailyCostCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<DailyCostInputs | null>(null);
  const [currentResults, setCurrentResults] = useState<DailyCostResults | null>(null);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('daily_cost_simulations')
      .select('id, month, year, total_animals, cost_per_arroba, profit_per_arroba, is_profitable, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedSimulations(data);
    }
    setLoading(false);
  };

  const handleCalculate = (inputs: DailyCostInputs, results: DailyCostResults) => {
    setCurrentInputs(inputs);
    setCurrentResults(results);
  };

  const handleSave = async (inputs: DailyCostInputs, results: DailyCostResults) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('daily_cost_simulations').insert({
        user_id: user.id,
        month: inputs.month,
        year: inputs.year,
        costs: inputs.costs,
        total_animals: inputs.total_animals,
        supplement_cost_per_kg: inputs.supplement_cost_per_kg,
        supplement_quantity_per_animal_day: inputs.supplement_quantity_per_animal_day,
        average_daily_gain_kg: inputs.average_daily_gain_kg,
        market_arroba_price: inputs.market_arroba_price,
        total_monthly_cost: results.total_monthly_cost,
        total_daily_cost: results.total_daily_cost,
        days_to_produce_arroba: results.days_to_produce_arroba,
        cost_per_arroba: results.cost_per_arroba,
        profit_per_arroba: results.profit_per_arroba,
        is_profitable: results.is_profitable,
      });

      if (!error) {
        alert('Simulação salva com sucesso!');
        await loadSimulations();
      } else {
        alert('Erro ao salvar simulação. Tente novamente.');
      }
    } catch (err) {
      alert('Erro ao salvar simulação. Tente novamente.');
    }
  };

  const handleExportPDF = (inputs: DailyCostInputs, results: DailyCostResults) => {
    generateDailyCostPDF(inputs, results);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Tem certeza que deseja excluir esta simulação?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('daily_cost_simulations')
      .delete()
      .eq('id', id);

    if (!error) {
      await loadSimulations();
    }
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cálculo da Diária</h1>
            <p className="text-gray-600 mt-1">Simulações salvas de custo diário</p>
          </div>
          <Button onClick={() => setView('form')} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Nova Simulação
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-500">Carregando simulações...</p>
            </CardContent>
          </Card>
        ) : savedSimulations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma simulação salva</h3>
              <p className="text-gray-600 mb-4">Comece criando sua primeira simulação de custo diário</p>
              <Button onClick={() => setView('form')} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeira Simulação
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSimulations.map((sim) => (
              <Card key={sim.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{sim.month}/{sim.year}</CardTitle>
                  <CardDescription>
                    {new Date(sim.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Animais:</span>
                      <span className="font-semibold">{sim.total_animals} cabeças</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Custo/@:</span>
                      <span className="font-semibold">R$ {sim.cost_per_arroba?.toFixed(2) || '0,00'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Lucro/@:</span>
                      <span className={`font-semibold ${sim.is_profitable ? 'text-green-600' : 'text-red-600'}`}>
                        R$ {sim.profit_per_arroba?.toFixed(2) || '0,00'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${sim.is_profitable ? 'text-green-600' : 'text-red-600'}`}>
                        {sim.is_profitable ? 'Lucrativo' : 'Não Lucrativo'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDelete(sim.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <CalculatorLayout
      title="Cálculo da Diária"
      description="Calcule custos operacionais mensais e margem de lucro por arroba produzida"
      icon={<DollarSign className="w-6 h-6" />}
      onBack={() => setView('list')}
      actions={
        <Button onClick={() => setView('list')} variant="outline">
          <List className="w-4 h-4 mr-2" />
          Ver Salvos
        </Button>
      }
    >
      <DailyCostForm
        onCalculate={handleCalculate}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
      />
    </CalculatorLayout>
  );
}
