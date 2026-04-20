import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calculator, FileDown, Save, ArrowLeft, List, Trash2, Eye, Plus } from 'lucide-react';
import { calculateCarcassYield, type CarcassYieldInputs, type CarcassYieldResults } from '../../lib/carcass-yield-calculator';
import { generateCarcassYieldPDF } from '../../lib/carcass-yield-pdf-generator';
import { supabase } from '../../lib/supabase';
import { Alert, AlertDescription } from '../ui/alert';
import { useAuth } from '../../contexts/AuthContext';

interface SavedCalculation {
  id: string;
  title: string;
  quantity_animals: number;
  total_arrobas: number;
  total_revenue: number;
  created_at: string;
}

export function CarcassYieldCalculator() {
  const { user } = useAuth();
  const [view, setView] = useState<'list' | 'form' | 'results'>('list');
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState<CarcassYieldInputs>({
    quantity_animals: 200,
    gmd_kg: 0.478,
    carcass_yield_percentage: 52,
    final_weight_kg: 600,
    arroba_price: 320,
  });

  const [title, setTitle] = useState('');
  const [results, setResults] = useState<CarcassYieldResults | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCalculations();
  }, []);

  const loadCalculations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('carcass_yield_calculations')
      .select('id, title, quantity_animals, total_arrobas, total_revenue, created_at')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedCalculations(data);
    }
    setLoading(false);
  };

  const handleInputChange = (field: keyof CarcassYieldInputs, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [field]: numValue,
    }));
  };

  const handleCalculate = () => {
    const calculatedResults = calculateCarcassYield(inputs);
    setResults(calculatedResults);
    setSaveMessage(null);
    setView('results');
  };

  const handleNewCalculation = () => {
    setResults(null);
    setTitle('');
    setSaveMessage(null);
    setInputs({
      quantity_animals: 200,
      gmd_kg: 0.478,
      carcass_yield_percentage: 52,
      final_weight_kg: 600,
      arroba_price: 320,
    });
    setView('form');
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Tem certeza que deseja excluir este cálculo?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('carcass_yield_calculations')
      .delete()
      .eq('id', id);

    if (!error) {
      await loadCalculations();
    }
  };

  const handleExportPDF = () => {
    if (!results) return;
    generateCarcassYieldPDF(inputs, results, title || 'Fechamento de Lote');
  };

  const handleSave = async () => {
    if (!results || !user) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase.from('carcass_yield_calculations').insert({
        user_id: user.id,
        title: title || 'Cálculo de Rendimento de Carcaça',
        quantity_animals: inputs.quantity_animals,
        gmd_kg: inputs.gmd_kg,
        carcass_yield_percentage: inputs.carcass_yield_percentage,
        final_weight_kg: inputs.final_weight_kg,
        arroba_price: inputs.arroba_price,
        total_carcass_weight_kg: results.total_carcass_weight_kg || 0,
        total_arrobas: results.total_arrobas || 0,
        total_revenue: results.total_revenue || 0,
        revenue_per_animal: results.revenue_per_animal || 0,
      });

      if (error) throw error;

      setSaveMessage({ type: 'success', text: 'Cálculo salvo com sucesso!' });
      await loadCalculations();
    } catch (error) {
      console.error('Error saving calculation:', error);
      setSaveMessage({ type: 'error', text: 'Erro ao salvar o cálculo. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fechamento de Lote</h1>
            <p className="text-gray-600 mt-1">Cálculos salvos de rendimento de carcaça</p>
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
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum cálculo salvo</h3>
              <p className="text-gray-600 mb-4">Comece criando seu primeiro cálculo de rendimento de carcaça</p>
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
                  <CardTitle className="text-lg">{calc.title}</CardTitle>
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
                      <span className="font-semibold">{calc.quantity_animals} cabeças</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total de Arrobas:</span>
                      <span className="font-semibold">{calc.total_arrobas?.toFixed(2) || 0} @</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Receita Total:</span>
                      <span className="font-semibold text-green-600">
                        R$ {calc.total_revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => view === 'results' ? handleNewCalculation() : setView('list')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fechamento de Lote</h1>
            <p className="text-gray-600 mt-1">Calcule o rendimento de carcaça e receita estimada</p>
          </div>
        </div>
        <Button onClick={() => setView('list')} variant="outline">
          <List className="w-4 h-4 mr-2" />
          Ver Salvos
        </Button>
      </div>

      {view === 'form' && !results ? (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Rebanho</CardTitle>
            <CardDescription>Informações básicas sobre o rebanho</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quantity_animals">Quantidade de Animais (cabeças)</Label>
                <Input
                  id="quantity_animals"
                  type="number"
                  value={inputs.quantity_animals}
                  onChange={(e) => handleInputChange('quantity_animals', e.target.value)}
                  min="1"
                  step="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gmd_kg">GMD - Ganho Médio Diário (kg/dia)</Label>
                <Input
                  id="gmd_kg"
                  type="number"
                  value={inputs.gmd_kg}
                  onChange={(e) => handleInputChange('gmd_kg', e.target.value)}
                  min="0"
                  step="0.001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carcass_yield_percentage">Rendimento de Carcaça (%)</Label>
                <Input
                  id="carcass_yield_percentage"
                  type="number"
                  value={inputs.carcass_yield_percentage}
                  onChange={(e) => handleInputChange('carcass_yield_percentage', e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <p className="text-sm text-gray-500">Tipicamente entre 50% e 55%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {view === 'form' && !results ? (
        <Card>
          <CardHeader>
            <CardTitle>Dados de Venda (Opcional)</CardTitle>
            <CardDescription>Preencha para calcular a receita estimada da venda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="final_weight_kg">Peso Final Estimado (kg)</Label>
                <Input
                  id="final_weight_kg"
                  type="number"
                  value={inputs.final_weight_kg || ''}
                  onChange={(e) => handleInputChange('final_weight_kg', e.target.value)}
                  min="0"
                  step="1"
                />
                <p className="text-sm text-gray-500">Peso vivo do animal na venda</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="arroba_price">Preço da Arroba (R$/@)</Label>
                <Input
                  id="arroba_price"
                  type="number"
                  value={inputs.arroba_price || ''}
                  onChange={(e) => handleInputChange('arroba_price', e.target.value)}
                  min="0"
                  step="0.01"
                />
                <p className="text-sm text-gray-500">Preço da arroba na sua região</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleCalculate} className="bg-green-600 hover:bg-green-700">
                <Calculator className="w-4 h-4 mr-2" />
                Calcular
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {results && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Título do Cálculo (Opcional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Ex: Lote de Boi Gordo - Março 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados do Cálculo</CardTitle>
              <CardDescription>Análise detalhada do rendimento de carcaça</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.carcass_weight_per_animal && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Peso de Carcaça/Animal</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {results.carcass_weight_per_animal.toFixed(2)} kg
                    </p>
                  </div>
                )}

                {results.total_carcass_weight_kg && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">Peso Total de Carcaça</p>
                    <p className="text-2xl font-bold text-green-900">
                      {results.total_carcass_weight_kg.toFixed(2)} kg
                    </p>
                  </div>
                )}

                {results.arrobas_per_animal && (
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 font-medium">Arrobas por Animal</p>
                    <p className="text-2xl font-bold text-orange-900">
                      {results.arrobas_per_animal.toFixed(2)} @
                    </p>
                  </div>
                )}

                {results.total_arrobas && (
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <p className="text-sm text-teal-600 font-medium">Total de Arrobas</p>
                    <p className="text-2xl font-bold text-teal-900">
                      {results.total_arrobas.toFixed(2)} @
                    </p>
                  </div>
                )}

                {results.revenue_per_animal && (
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <p className="text-sm text-emerald-600 font-medium">Receita por Animal</p>
                    <p className="text-2xl font-bold text-emerald-900">
                      R$ {results.revenue_per_animal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {results.total_revenue && (
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <p className="text-sm text-cyan-600 font-medium">Receita Total Estimada</p>
                    <p className="text-2xl font-bold text-cyan-900">
                      R$ {results.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Como o cálculo foi feito:</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <strong>1. Peso de Carcaça por Animal:</strong> Peso Vivo × (Rendimento de Carcaça / 100)
                    {results.carcass_weight_per_animal && inputs.final_weight_kg && (
                      <span className="text-gray-600 ml-2">
                        = {inputs.final_weight_kg} kg × {inputs.carcass_yield_percentage}% = {results.carcass_weight_per_animal.toFixed(2)} kg
                      </span>
                    )}
                  </p>
                  <p>
                    <strong>2. Peso Total de Carcaça:</strong> Peso de Carcaça por Animal × Quantidade de Animais
                    {results.total_carcass_weight_kg && results.carcass_weight_per_animal && (
                      <span className="text-gray-600 ml-2">
                        = {results.carcass_weight_per_animal.toFixed(2)} kg × {inputs.quantity_animals} = {results.total_carcass_weight_kg.toFixed(2)} kg
                      </span>
                    )}
                  </p>
                  <p>
                    <strong>3. Arrobas por Animal:</strong> Peso de Carcaça por Animal / 15 kg
                    {results.arrobas_per_animal && results.carcass_weight_per_animal && (
                      <span className="text-gray-600 ml-2">
                        = {results.carcass_weight_per_animal.toFixed(2)} kg / 15 = {results.arrobas_per_animal.toFixed(2)} @
                      </span>
                    )}
                  </p>
                  <p>
                    <strong>4. Receita por Animal:</strong> Arrobas por Animal × Preço da Arroba
                    {results.revenue_per_animal && results.arrobas_per_animal && inputs.arroba_price && (
                      <span className="text-gray-600 ml-2">
                        = {results.arrobas_per_animal.toFixed(2)} @ × R$ {inputs.arroba_price} = R$ {results.revenue_per_animal.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {saveMessage && (
                <Alert className={saveMessage.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                  <AlertDescription className={saveMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {saveMessage.text}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-wrap gap-3">
                <Button onClick={() => setView('list')} variant="outline">
                  <List className="w-4 h-4 mr-2" />
                  Ver Salvos
                </Button>
                <Button onClick={handleNewCalculation} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Cálculo
                </Button>
                <Button onClick={handleExportPDF} variant="outline">
                  <FileDown className="w-4 h-4 mr-2" />
                  Exportar PDF
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar Cálculo'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
