import { useState } from 'react';
import { ChevronRight, CheckCircle, AlertCircle, Beef } from 'lucide-react';

type Props = {
  onComplete: () => void;
};

const steps = [
  {
    title: 'Bem-vindo ao Pecuária Simulador Pro',
    description: 'A ferramenta completa para simular a viabilidade financeira de operações de engorda de gado.',
    icon: Beef,
  },
  {
    title: 'Como funciona',
    description: 'Você irá preencher informações sobre seu rebanho, custos e receitas. O sistema calculará automaticamente a viabilidade da operação.',
    icon: CheckCircle,
  },
  {
    title: 'Importante saber',
    description: 'Campos com fundo branco são editáveis. Campos com fundo amarelo mostram resultados calculados automaticamente e não podem ser editados.',
    icon: AlertCircle,
  },
];

export function OnboardingScreen({ onComplete }: Props) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <Icon className="w-10 h-10 text-green-600" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
            {step.title}
          </h2>

          <p className="text-lg text-gray-600 text-center mb-8">
            {step.description}
          </p>

          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-green-600'
                    : index < currentStep
                    ? 'w-2 bg-green-400'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            {currentStep < steps.length - 1 ? 'Próximo' : 'Começar'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
