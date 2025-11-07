import { Simulation } from '../../lib/supabase';
import { Calendar, TrendingUp, TrendingDown, Trash2, Plus, Eye } from 'lucide-react';

type Props = {
  simulations: Simulation[];
  loading: boolean;
  onDelete: (id: string) => void;
  onCreate: () => void;
  onView: (simulation: Simulation) => void;
};

export function SimulationList({ simulations, loading, onDelete, onCreate, onView }: Props) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Nenhuma simulação ainda</h3>
        <p className="text-gray-600 mb-6">Crie sua primeira simulação para começar</p>
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
        >
          <Plus className="w-5 h-5" />
          Nova Simulação
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Minhas Simulações</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations.map((simulation) => {
          const isProfit = simulation.result_per_animal > 0;
          const totalResult = simulation.result_per_animal * simulation.quantity;

          return (
            <div
              key={simulation.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{simulation.title}</h3>
                  <p className="text-sm text-gray-500">{simulation.quantity} animais</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Deseja realmente excluir esta simulação?')) {
                      onDelete(simulation.id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className={`p-3 rounded-lg ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {isProfit ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-xs text-gray-600">Resultado Total</span>
                  </div>
                  <p className={`text-xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(totalResult)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Por Animal</p>
                    <p className="font-semibold">{formatCurrency(simulation.result_per_animal)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Margem</p>
                    <p className="font-semibold">{simulation.profit_margin_percentage.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {formatDate(simulation.created_at)}
                </div>
                <button
                  onClick={() => onView(simulation)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Ver Detalhes
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
