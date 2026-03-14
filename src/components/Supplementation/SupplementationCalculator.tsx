import { useState, useEffect } from 'react';
import { SupplementationInputs, SupplementationResults, calculateSupplementation } from '../../lib/supplementation-calculator';
import { generateSupplementationPDF } from '../../lib/supplementation-pdf-generator';
import { SupplementationForm } from './SupplementationForm';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Package, Plus, List, Trash2, Eye } from 'lucide-react';
import { CalculatorLayout } from '../Layout/CalculatorLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface SavedCalculation {
  id: string;
  quantity_heads: number;
  supplementation_type: string;
  daily_consumption_kg: number;
  bags_per_day: number;
  created_at: string;
}

export function SupplementationCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form' | 'results'>('list');
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInputs, setCurrentInputs] = useState<SupplementationInputs | null>(null);
  const [currentResults, setCurrentResults] = useState<SupplementationResults | null>(null);

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('supplementation_calculations')
      .select('id, quantity_heads, supplementation_type, daily_consumption_kg, bags_per_day, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedCalculations(data);
    }
    setLoading(false);
  };

  const handleCalculate = (inputs: SupplementationInputs, results: SupplementationResults) => {
    setCurrentInputs(inputs);
    setCurrentResults(results);
    setView('results');
  };

  const handleViewDetails = async (id: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('supplementation_calculations')
      .select('*')
      .eq('id', id)
      .single();

    if (!error && data) {
      const inputs: SupplementationInputs = {
        animal_quantity: data.quantity_heads,
        average_weight_kg: Number(data.average_weight_kg),
        supplementation_type: data.supplementation_type,
        consumption_percentage: Number(data.consumption_percentage),
        bag_weight_kg: Number(data.bag_weight_kg)
      };

      const results = calculateSupplementation(inputs);
      setCurrentInputs(inputs);
      setCurrentResults(results);
      setView('results');
    }
    setLoading(false);
  };

  const handleSave = async (inputs: SupplementationInputs, results: SupplementationResults) => {
    if (!user) return;

    try {
      const title = `Suplementação - ${inputs.animal_quantity} cabeças`;
      const { error } = await supabase.from('supplementation_calculations').insert({
        user_id: user.id,
        title,
        quantity_heads: inputs.animal_quantity,
        average_weight_kg: inputs.average_weight_kg,
        supplementation_type: inputs.supplementation_type,
        consumption_percentage: inputs.consumption_percentage,
        bag_weight_kg: inputs.bag_weight_kg,
        daily_consumption_kg: results.daily_consumption_kg,
        bags_per_day: results.bags_per_day,
      });

      if (!error) {
        alert('Cálculo salvo com sucesso!');
        await loadCalculations();
      } else {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar cálculo. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro ao salvar cálculo. Tente novamente.');
    }
  };

  const handleExportPDF = (inputs: SupplementationInputs, results: SupplementationResults) => {
    generateSupplementationPDF(inputs, results);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Tem certeza que deseja excluir este cálculo?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('supplementation_calculations')
      .delete()
      .eq('id', id);

    if (!error) {
      await loadCalculations();
    }
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cálculo de Suplementação</h1>
            <p className="text-gray-600 mt-1">Cálculos salvos de suplementação</p>
          </div>
          <Button onClick={() => setView('form')} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Novo Cálculo
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-gray-500">Carregando cálculos...</p>
            </CardContent>
          </Card>
        ) : savedCalculations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cálculo salvo</h3>
              <p className="text-gray-600 mb-4">Comece criando seu primeiro cálculo de suplementação</p>
              <Button onClick={() => setView('form')} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Cálculo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedCalculations.map((calc) => (
              <Card key={calc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Suplementação - {calc.supplementation_type}</CardTitle>
                  <CardDescription>
                    {new Date(calc.created_at).toLocaleDateString('pt-BR', {
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
                      <span className="font-semibold">{calc.quantity_heads} cabeças</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Consumo Diário:</span>
                      <span className="font-semibold">{calc.daily_consumption_kg.toFixed(2)} kg</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sacos/Dia:</span>
                      <span className="font-semibold text-green-600">{calc.bags_per_day.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleViewDetails(calc.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(calc.id)}
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

  if (view === 'form') {
    return (
      <CalculatorLayout
        title="Cálculo de Suplementação"
        description="Determine a quantidade exata de suplemento necessária para seu rebanho diariamente"
        icon={<Package className="w-6 h-6" />}
        onBack={() => setView('list')}
        actions={
          <Button onClick={() => setView('list')} variant="outline">
            <List className="w-4 h-4 mr-2" />
            Ver Salvos
          </Button>
        }
      >
        <SupplementationForm
          onCalculate={handleCalculate}
          onSave={handleSave}
          onExportPDF={handleExportPDF}
        />
      </CalculatorLayout>
    );
  }

  if (view === 'results' && currentInputs && currentResults) {
    return (
      <CalculatorLayout
        title="Resultados - Suplementação"
        description="Confira os resultados do cálculo de suplementação"
        icon={<Package className="w-6 h-6" />}
        onBack={() => setView('form')}
        actions={
          <Button onClick={() => setView('list')} variant="outline">
            <List className="w-4 h-4 mr-2" />
            Ver Salvos
          </Button>
        }
      >
        <SupplementationForm
          onCalculate={handleCalculate}
          onSave={handleSave}
          onExportPDF={handleExportPDF}
          initialInputs={currentInputs}
          initialResults={currentResults}
        />
      </CalculatorLayout>
    );
  }

  return null;
}
