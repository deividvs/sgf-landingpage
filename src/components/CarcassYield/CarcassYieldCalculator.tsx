import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Calculator, FileDown, Save, ArrowLeft } from 'lucide-react';
import { calculateCarcassYield, type CarcassYieldInputs, type CarcassYieldResults } from '../../lib/carcass-yield-calculator';
import { generateCarcassYieldPDF } from '../../lib/carcass-yield-pdf-generator';
import { supabase } from '../../lib/supabase';
import { Alert, AlertDescription } from '../ui/alert';

export function CarcassYieldCalculator() {
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
  };

  const handleNewCalculation = () => {
    setResults(null);
    setTitle('');
    setSaveMessage(null);
  };

  const handleExportPDF = () => {
    if (!results) return;
    generateCarcassYieldPDF(inputs, results, title || 'Cálculo de Rendimento de Carcaça');
  };

  const handleSave = async () => {
    if (!results) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setSaveMessage({ type: 'error', text: 'Você precisa estar autenticado para salvar.' });
        setIsSaving(false);
        return;
      }

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
    } catch (error) {
      console.error('Error saving calculation:', error);
      setSaveMessage({ type: 'error', text: 'Erro ao salvar o cálculo. Tente novamente.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rendimento de Carcaça</h1>
          <p className="text-gray-600 mt-1">Calcule o rendimento de carcaça e receita estimada</p>
        </div>
      </div>

      {!results ? (
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

      {!results ? (
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
                <Button onClick={handleNewCalculation} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
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
