import { useState } from 'react';
import { ArrowLeft, Download, Save, Award } from 'lucide-react';
import PurchaseForm from './PurchaseForm';
import {
  calculatePurchaseSimulation,
  type PurchaseSimulationResults,
} from '../../lib/purchase-calculator';
import { generatePurchasePDF } from '../../lib/purchase-pdf-generator';
import { supabase } from '../../lib/supabase';

interface PurchaseCalculatorProps {
  onBack: () => void;
}

export default function PurchaseCalculator({ onBack }: PurchaseCalculatorProps) {
  const [results, setResults] = useState<PurchaseSimulationResults | null>(null);
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCalculate = (suppliers: any[]) => {
    const calculatedResults = calculatePurchaseSimulation({ suppliers });
    setResults(calculatedResults);
  };

  const handleSave = async () => {
    if (!results) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert('Você precisa estar logado para salvar simulações');
        return;
      }

      const { error } = await supabase.from('purchase_simulations').insert({
        user_id: user.id,
        title: title || `Simulação de Compra - ${new Date().toLocaleDateString('pt-BR')}`,
        suppliers: results.suppliers,
        best_supplier_index: results.best_supplier_index,
      });

      if (error) throw error;

      alert('Simulação salva com sucesso!');
      setTitle('');
    } catch (error) {
      console.error('Error saving simulation:', error);
      alert('Erro ao salvar simulação. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!results) return;
    generatePurchasePDF(
      results,
      title || `Simulação de Compra - ${new Date().toLocaleDateString('pt-BR')}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Simulação de Compra de Gado
          </h1>
          <p className="text-gray-600 mb-6">
            Compare fornecedores e encontre a melhor opção de compra
          </p>

          {!results ? (
            <PurchaseForm onSubmit={handleCalculate} />
          ) : (
            <div className="space-y-6">
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Título da simulação (opcional)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  <Save size={20} />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={20} />
                  Baixar PDF
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.suppliers.map((supplier, index) => {
                  const isBest = index === results.best_supplier_index;

                  return (
                    <div
                      key={index}
                      className={`rounded-lg p-6 border-2 transition-all ${
                        isBest
                          ? 'border-green-500 bg-green-50 shadow-lg'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      {isBest && (
                        <div className="flex items-center gap-2 mb-3 text-green-700">
                          <Award size={24} />
                          <span className="font-bold text-sm">MELHOR OPÇÃO</span>
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-gray-800 mb-1">
                        {supplier.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">{supplier.city}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Distância:</span>
                          <span className="font-semibold">{supplier.distance_km} km</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Quantidade:</span>
                          <span className="font-semibold">{supplier.quantity} cab</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Peso Médio:</span>
                          <span className="font-semibold">{supplier.weight_kg} kg</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3 mb-3">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">R$/kg:</span>
                          <span className="font-semibold">
                            {supplier.price_per_kg.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600">R$/Cabeça:</span>
                          <span className="font-semibold">
                            {supplier.price_per_head.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-3 mb-3">
                        <p className="text-xs text-gray-500 mb-2">Custos Adicionais:</p>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Comissão:</span>
                          <span className="text-sm">
                            R$ {supplier.commission_value.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">ICMS:</span>
                          <span className="text-sm">
                            R$ {supplier.icms_value.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Frete:</span>
                          <span className="text-sm">
                            R$ {supplier.freight_per_head.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className={`rounded-lg p-3 ${isBest ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Preço Final/Cab:
                          </span>
                          <span className="text-lg font-bold text-gray-800">
                            R$ {supplier.final_price_per_head.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-600">Total Lote:</span>
                          <span className="text-sm font-bold text-gray-700">
                            R$ {supplier.final_price_total.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Custo/@:</span>
                          <span className="font-bold">
                            R$ {supplier.cost_per_arroba.toLocaleString('pt-BR', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Custo/Kg:</span>
                          <span className="font-bold">
                            R$ {supplier.cost_per_kg.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Qualidade:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-lg font-bold text-gray-800">
                              {supplier.quality_score}
                            </span>
                            <span className="text-xs text-gray-500">/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setResults(null)}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
              >
                Nova Simulação
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
