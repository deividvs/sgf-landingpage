import { useState } from 'react';
import type { ProductionCostInputs } from '../../lib/production-cost-calculator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ProductionCostFormProps {
  onCalculate: (inputs: ProductionCostInputs) => void;
}

export function ProductionCostForm({ onCalculate }: ProductionCostFormProps) {
  const [formData, setFormData] = useState<ProductionCostInputs>({
    quantity_animals: 200,
    lease_monthly: 12000,
    supplementation_monthly: 8000,
    labor_monthly: 5000,
    variable_costs_monthly: 3500,
    gmd_kg: 15,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(formData);
  };

  const handleChange = (field: keyof ProductionCostInputs, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: parseFloat(value) || 0,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dados do Rebanho</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="quantity_animals">
                Quantidade de Animais (cabeças)
              </Label>
              <Input
                id="quantity_animals"
                type="number"
                value={formData.quantity_animals}
                onChange={(e) => handleChange('quantity_animals', e.target.value)}
                min="1"
                step="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gmd_kg">
                GMD - Ganho Médio Diário Mensal (kg/mês)
              </Label>
              <Input
                id="gmd_kg"
                type="number"
                value={formData.gmd_kg}
                onChange={(e) => handleChange('gmd_kg', e.target.value)}
                min="0.1"
                max="100"
                step="0.01"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Custos Mensais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lease_monthly">
                Arrendamento Mensal (R$)
              </Label>
              <Input
                id="lease_monthly"
                type="number"
                value={formData.lease_monthly}
                onChange={(e) => handleChange('lease_monthly', e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplementation_monthly">
                Suplementação Mensal (R$)
              </Label>
              <Input
                id="supplementation_monthly"
                type="number"
                value={formData.supplementation_monthly}
                onChange={(e) => handleChange('supplementation_monthly', e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="labor_monthly">
                Mão de Obra Mensal (R$)
              </Label>
              <Input
                id="labor_monthly"
                type="number"
                value={formData.labor_monthly}
                onChange={(e) => handleChange('labor_monthly', e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variable_costs_monthly">
                Custos Variáveis Mensais (R$)
              </Label>
              <Input
                id="variable_costs_monthly"
                type="number"
                value={formData.variable_costs_monthly}
                onChange={(e) => handleChange('variable_costs_monthly', e.target.value)}
                min="0"
                step="0.01"
                required
              />
              <p className="text-xs text-muted-foreground">
                Combustível, energia, medicamentos, etc.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" size="lg">
        Calcular Custo de Produção
      </Button>
    </form>
  );
}
