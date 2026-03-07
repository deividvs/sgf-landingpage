import { ReactNode } from 'react';
import { useSubscription } from '../../hooks/useSubscription';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface SubscriptionGateProps {
  children: ReactNode;
}

export function SubscriptionGate({ children }: SubscriptionGateProps) {
  const { subscription, isActive, loading, error } = useSubscription();
  const { user } = useAuth();

  const bypassSubscription = import.meta.env.VITE_BYPASS_SUBSCRIPTION === 'true';
  const isDevelopment = import.meta.env.DEV;

  if (bypassSubscription && isDevelopment) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
            <p className="text-gray-600">Verificando assinatura...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro ao verificar assinatura</h3>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-3xl">Acesso Negado</CardTitle>
            <CardDescription className="text-base">
              Seu email {user?.email} não consta em nossas compras aprovadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Você precisa adquirir o acesso ao sistema para usar as ferramentas. Após a compra, faça login com o mesmo email usado na compra.
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-gray-900">O que você terá acesso:</h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Simulador de Resultados completo</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Calculadora de Diluição de Ágio</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Cálculo de Suplementação</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Taxa de Lotação</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Apuração de Resultados Anuais</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>E todas as outras ferramentas premium</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  const checkoutUrl = import.meta.env.VITE_HOTMART_CHECKOUT_URL;
                  if (checkoutUrl) {
                    window.open(checkoutUrl, '_blank');
                  } else {
                    alert('URL de checkout não configurada');
                  }
                }}
              >
                Adquirir Acesso
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Após a compra, faça login com o email utilizado na compra
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isActive) {
    const statusMessages = {
      pending: {
        icon: <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />,
        title: 'Assinatura Pendente',
        description: 'Sua assinatura está sendo processada',
        message: 'Aguarde a confirmação do pagamento. Isso pode levar alguns minutos.',
        bgColor: 'bg-amber-100',
      },
      expired: {
        icon: <XCircle className="w-8 h-8 text-red-600" />,
        title: 'Assinatura Expirada',
        description: 'Sua assinatura expirou',
        message: 'Renove sua assinatura para continuar acessando todas as ferramentas.',
        bgColor: 'bg-red-100',
      },
      cancelled: {
        icon: <XCircle className="w-8 h-8 text-gray-600" />,
        title: 'Assinatura Cancelada',
        description: 'Sua assinatura foi cancelada',
        message: 'Adquira novamente para ter acesso ao sistema.',
        bgColor: 'bg-gray-100',
      },
    };

    const status = statusMessages[subscription.subscription_status as keyof typeof statusMessages] || statusMessages.expired;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className={`w-16 h-16 ${status.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {status.icon}
            </div>
            <CardTitle className="text-2xl">{status.title}</CardTitle>
            <CardDescription>{status.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600 text-center">{status.message}</p>

            {subscription.subscription_status !== 'pending' && (
              <Button
                size="lg"
                className="w-full"
                onClick={() => {
                  const checkoutUrl = import.meta.env.VITE_HOTMART_CHECKOUT_URL;
                  if (checkoutUrl) {
                    window.open(checkoutUrl, '_blank');
                  } else {
                    alert('URL de checkout não configurada');
                  }
                }}
              >
                Renovar Assinatura
              </Button>
            )}

            {subscription.subscription_status === 'pending' && (
              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Verificar Novamente
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
