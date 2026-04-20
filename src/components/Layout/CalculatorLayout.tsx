import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface CalculatorLayoutProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  onBack?: () => void;
  children: ReactNode;
  actions?: ReactNode;
}

export function CalculatorLayout({
  title,
  description,
  icon,
  onBack,
  children,
  actions
}: CalculatorLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      <Separator />

      <div className="pb-8">
        {children}
      </div>
    </div>
  );
}
