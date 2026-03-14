import { useState, useEffect } from 'react';
import { StockingRateInputs, StockingRateResults } from '../../lib/stocking-rate-calculator';
import { generateStockingRatePDF } from '../../lib/stocking-rate-pdf-generator';
import { StockingRateForm } from './StockingRateForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { MapPin, Plus, List, Trash2 } from 'lucide-react';
import { CalculatorLayout } from '../Layout/CalculatorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface SavedSimulation {
  id: string;
  area_ha: number;
  animal_quantity: number;
  stocking_rate_ua_ha: number;
  classification: string;
  created_at: string;
}

export function StockingRateCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form'>('list');
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<StockingRateInputs | null>(null);
  const [currentResults, setCurrentResults] = useState<StockingRateResults | null>(null);

  useEffect(() => {
    loadSimulations();
  }, []);

  const loadSimulations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stocking_rate_simulations')
      .select('id, area_ha, animal_quantity, stocking_rate_ua_ha, classification, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedSimulations(data);
    }
    setLoading(false);
  };

  const handleCalculate = (inputs: StockingRateInputs, results: StockingRateResults) => {
    setCurrentInputs(inputs);
    setCurrentResults(results);
  };

  const handleSave = async (inputs: StockingRateInputs, results: StockingRateResults) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('stocking_rate_simulations').insert({
        user_id: user.id,
        area_ha: inputs.area_ha,
        animal_quantity: inputs.animal_quantity,
        average_weight_kg: inputs.average_weight_kg,
        total_weight_kg: results.total_weight_kg,
        total_animal_units: results.total_animal_units,
        stocking_rate_ua_ha: results.stocking_rate_ua_ha,
        classification: results.classification,
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

  const handleExportPDF = (inputs: StockingRateInputs, results: StockingRateResults) => {
    generateStockingRatePDF(inputs, results);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Tem certeza que deseja excluir esta simulação?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('stocking_rate_simulations')
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
            <h1 className="text-3xl font-bold text-gray-900">Taxa de Lotação</h1>
            <p className="text-gray-600 mt-1">Simulações salvas de taxa de lotação</p>
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
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma simulação salva</h3>
              <p className="text-gray-600 mb-4">Comece criando sua primeira simulação de taxa de lotação</p>
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
                  <CardTitle className="text-lg">Taxa de Lotação</CardTitle>
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
                      <span className="text-gray-600">Área:</span>
                      <span className="font-semibold">{sim.area_ha} ha</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Animais:</span>
                      <span className="font-semibold">{sim.animal_quantity} cabeças</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxa UA/ha:</span>
                      <span className="font-semibold">{sim.stocking_rate_ua_ha?.toFixed(2) || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Classificação:</span>
                      <span className={`font-semibold ${
                        sim.classification === 'Alta' ? 'text-red-600' :
                        sim.classification === 'Média' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {sim.classification}
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
      title="Taxa de Lotação"
      description="Calcule a taxa de lotação e otimize o uso da sua pastagem"
      icon={<MapPin className="w-6 h-6" />}
      onBack={() => setView('list')}
      actions={
        <Button onClick={() => setView('list')} variant="outline">
          <List className="w-4 h-4 mr-2" />
          Ver Salvos
        </Button>
      }
    >
      <StockingRateForm
        onCalculate={handleCalculate}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
      />
    </CalculatorLayout>
  );
}
