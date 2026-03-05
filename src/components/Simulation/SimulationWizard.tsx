import { useState } from 'react';
import { SimulationInputs, calculateSimulation, SimulationResults } from '../../lib/calculations';
import { HerdInfoStep } from './steps/HerdInfoStep';
import { LeaseStep } from './steps/LeaseStep';
import { LaborStep } from './steps/LaborStep';
import { SupplementStep } from './steps/SupplementStep';
import { OtherExpensesStep } from './steps/OtherExpensesStep';
import { ArrobaValueStep } from './steps/ArrobaValueStep';
import { ResultsView } from './ResultsView';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Informações do Rebanho' },
  { id: 2, title: 'Arrendamento' },
  { id: 3, title: 'Mão de Obra' },
  { id: 4, title: 'Suplementação' },
  { id: 5, title: 'Outras Despesas' },
  { id: 6, title: 'Valor da Arroba' },
];

type Props = {
  onSave: (inputs: SimulationInputs, results: SimulationResults) => Promise<void>;
};

export function SimulationWizard({ onSave }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SimulationResults | null>(null);

  const [formData, setFormData] = useState<SimulationInputs>({
    herd_description: '',
    quantity: 0,
    initial_weight: 0,
    final_weight: 0,
    carcass_yield_percentage: 52,
    acquisition_value_per_kg: 0,
    average_daily_gain: 0,
    lease_monthly_per_head: 0,
    workers_count: 0,
    labor_monthly_per_worker: 0,
    supplement_bag_price: 0,
    supplement_bag_weight: 30,
    supplement_percentage: 0,
    supplement_daily_consumption: 0,
    other_expenses_monthly_per_head: 0,
    arroba_value: 0,
  });

  const updateFormData = (data: Partial<SimulationInputs>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCalculate = () => {
    const calculatedResults = calculateSimulation(formData);
    setResults(calculatedResults);
    setShowResults(true);
  };

  const handleNewSimulation = () => {
    setShowResults(false);
    setCurrentStep(1);
    setResults(null);
    setFormData({
      herd_description: '',
      quantity: 0,
      initial_weight: 0,
      final_weight: 0,
      carcass_yield_percentage: 52,
      acquisition_value_per_kg: 0,
      average_daily_gain: 0,
      lease_monthly_per_head: 0,
      workers_count: 0,
      labor_monthly_per_worker: 0,
      supplement_bag_price: 0,
      supplement_bag_weight: 30,
      supplement_percentage: 0,
      supplement_daily_consumption: 0,
      other_expenses_monthly_per_head: 0,
      arroba_value: 0,
    });
  };

  const handleSave = async () => {
    if (results) {
      await onSave(formData, results);
    }
  };

  if (showResults && results) {
    return (
      <ResultsView
        inputs={formData}
        results={results}
        onNewSimulation={handleNewSimulation}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep === step.id
                      ? 'bg-green-600 text-white'
                      : currentStep > step.id
                      ? 'bg-green-100 text-green-600'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step.id}
                </div>
                <span className="text-xs mt-2 text-center text-gray-600 hidden sm:block">
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-1 flex-1 mx-2 ${
                    currentStep > step.id ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {STEPS[currentStep - 1].title}
        </h2>

        {currentStep === 1 && <HerdInfoStep data={formData} onUpdate={updateFormData} />}
        {currentStep === 2 && <LeaseStep data={formData} onUpdate={updateFormData} />}
        {currentStep === 3 && <LaborStep data={formData} onUpdate={updateFormData} />}
        {currentStep === 4 && <SupplementStep data={formData} onUpdate={updateFormData} />}
        {currentStep === 5 && <OtherExpensesStep data={formData} onUpdate={updateFormData} />}
        {currentStep === 6 && <ArrobaValueStep data={formData} onUpdate={updateFormData} />}

        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          {currentStep === STEPS.length ? (
            <button
              onClick={handleCalculate}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Calcular Resultados
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Próximo
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
