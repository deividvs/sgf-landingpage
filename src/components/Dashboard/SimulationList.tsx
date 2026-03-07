import { Simulation } from '../../lib/localStorage';
import { Calendar, TrendingUp, TrendingDown, Trash2, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

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
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (simulations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Plus className="w-12 h-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Nenhuma simulação ainda</h3>
        <p className="text-muted-foreground mb-6">Crie sua primeira simulação para começar</p>
        <Button onClick={onCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Simulação
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Minhas Simulações</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {simulations.map((simulation) => {
          const isProfit = simulation.result_per_animal > 0;
          const totalResult = simulation.result_per_animal * simulation.quantity;

          return (
            <Card key={simulation.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{simulation.title}</CardTitle>
                    <CardDescription>{simulation.quantity} animais</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (window.confirm('Deseja realmente excluir esta simulação?')) {
                        onDelete(simulation.id);
                      }
                    }}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-3 rounded-lg ${isProfit ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    {isProfit ? (
                      <TrendingUp className="w-5 h-5 text-primary" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-destructive" />
                    )}
                    <span className="text-xs text-muted-foreground">Resultado Total</span>
                  </div>
                  <p className={`text-xl font-bold ${isProfit ? 'text-primary' : 'text-destructive'}`}>
                    {formatCurrency(totalResult)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Por Animal</p>
                    <p className="font-semibold">{formatCurrency(simulation.result_per_animal)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Margem</p>
                    <p className="font-semibold">{simulation.profit_margin_percentage.toFixed(1)}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(simulation.created_at)}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(simulation)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
