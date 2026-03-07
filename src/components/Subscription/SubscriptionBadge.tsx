import { useSubscription } from '../../hooks/useSubscription';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SubscriptionBadge() {
  const { subscription, isActive, loading } = useSubscription();

  if (loading) {
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
        Verificando...
      </Badge>
    );
  }

  if (!subscription) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              <XCircle className="w-3 h-3 mr-1" />
              Sem Assinatura
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Você não possui uma assinatura ativa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (isActive) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ativa
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sua assinatura está ativa</p>
            {subscription.expires_at && (
              <p className="text-xs">
                Expira em: {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (subscription.subscription_status === 'pending') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              <Clock className="w-3 h-3 mr-1" />
              Pendente
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Aguardando confirmação de pagamento</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (subscription.subscription_status === 'expired') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              <XCircle className="w-3 h-3 mr-1" />
              Expirada
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sua assinatura expirou</p>
            {subscription.expires_at && (
              <p className="text-xs">
                Expirou em: {new Date(subscription.expires_at).toLocaleDateString('pt-BR')}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (subscription.subscription_status === 'cancelled') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              <XCircle className="w-3 h-3 mr-1" />
              Cancelada
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Assinatura cancelada</p>
            {subscription.cancelled_at && (
              <p className="text-xs">
                Cancelada em: {new Date(subscription.cancelled_at).toLocaleDateString('pt-BR')}
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return null;
}
