import { useState, useEffect } from 'react';
import { PremiumInputs, PremiumResults } from '../../lib/premium-calculator';
import { PremiumForm } from './PremiumForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Calculator, Plus, List, Trash2 } from 'lucide-react';
import { CalculatorLayout } from '../Layout/CalculatorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface SavedSimulation {
  id: string;
  current_arroba_value: number;
  animal_paid_value: number;
  premium_discount_percentage: number;
  daily_premium_to_dilute: number;
  created_at: string;
}

export function PremiumCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<PremiumInputs | null>(null);
  const [currentResults, setCurrentResults] = useState<PremiumResults | null>(null);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('premium_simulations')
      .select('id, current_arroba_value, animal_paid_value, premium_discount_percentage, daily_premium_to_dilute, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedSimulations(data);
    }
    setLoading(false);
  };

  const handleCalculate = (inputs: PremiumInputs, results: PremiumResults) => {
    setCurrentInputs(inputs);
    setCurrentResults(results);
  };

  const handleSave = async (inputs: PremiumInputs, results: PremiumResults) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('premium_simulations').insert({
        user_id: user.id,
        current_arroba_value: inputs.current_arroba_value,
        animal_paid_value: inputs.animal_paid_value,
        purchase_weight_kg: inputs.purchase_weight_kg,
        rearing_period_days: inputs.rearing_period_days,
        arrobas_at_purchase: results.arrobas_at_purchase,
        cost_per_kg: results.cost_per_kg,
        paid_price_per_arroba: results.paid_price_per_arroba,
        premium_discount_per_arroba: results.premium_discount_per_arroba,
        premium_discount_percentage: results.premium_discount_percentage,
        total_premium_discount_per_animal: results.total_premium_discount_per_animal,
        daily_premium_to_dilute: results.daily_premium_to_dilute,
        daily_gain_needed_kg: results.daily_gain_needed_kg,
        additional_weight_needed_kg: results.additional_weight_needed_kg,
        situation: results.situation,
      });

      if (!error) {
        alert('Simulação salva com sucesso!');
        await loadSimulations();
      } else {
        alert('Erro ao salvar simulação. Tente novamente.');
        console.error('Erro ao salvar:', error);
      }
    } catch (err) {
      alert('Erro ao salvar simulação. Tente novamente.');
      console.error('Erro ao salvar:', err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Tem certeza que deseja excluir esta simulação?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('premium_simulations')
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
            <h1 className="text-3xl font-bold text-gray-900">Diluir Ágio</h1>
            <p className="text-gray-600 mt-1">Simulações salvas de ágio</p>
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
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma simulação salva</h3>
              <p className="text-gray-600 mb-4">Comece criando sua primeira simulação de ágio</p>
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
                  <CardTitle className="text-lg">Simulação de Ágio</CardTitle>
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
                      <span className="text-gray-600">Valor da Arroba:</span>
                      <span className="font-semibold">R$ {sim.current_arroba_value.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Ágio/Deságio:</span>
                      <span className={`font-semibold ${sim.premium_discount_percentage >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {sim.premium_discount_percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Diária para Diluir:</span>
                      <span className="font-semibold">R$ {sim.daily_premium_to_dilute?.toFixed(2) || '0,00'}</span>
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
      title="Diluir Ágio"
      description="Calcule quantos dias são necessários para diluir o ágio pago na compra de animais"
      icon={<Calculator className="w-6 h-6" />}
      onBack={() => setView('list')}
      actions={
        <Button onClick={() => setView('list')} variant="outline">
          <List className="w-4 h-4 mr-2" />
          Ver Salvos
        </Button>
      }
    >
      <PremiumForm onCalculate={handleCalculate} onSave={handleSave} />
    </CalculatorLayout>
  );
}
