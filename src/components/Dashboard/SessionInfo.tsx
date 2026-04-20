import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getSessionTimeRemaining, isSessionExpiringSoon } from '@/lib/session-utils';

export function SessionInfo() {
  const { sessionExpiresAt } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isExpiring, setIsExpiring] = useState(false);

  useEffect(() => {
    const updateSessionInfo = () => {
      if (sessionExpiresAt) {
        setTimeRemaining(getSessionTimeRemaining(sessionExpiresAt));
        setIsExpiring(isSessionExpiringSoon(sessionExpiresAt));
      }
    };

    updateSessionInfo();
    const interval = setInterval(updateSessionInfo, 60000);

    return () => clearInterval(interval);
  }, [sessionExpiresAt]);

  if (!timeRemaining || timeRemaining === 'Sessão expirada') {
    return null;
  }

  return (
    <Alert className={`${isExpiring ? 'border-yellow-500 bg-yellow-50' : 'border-blue-200 bg-blue-50'}`}>
      {isExpiring ? (
        <Clock className="h-4 w-4 text-yellow-600" />
      ) : (
        <Info className="h-4 w-4 text-blue-600" />
      )}
      <AlertDescription className={isExpiring ? 'text-yellow-800' : 'text-blue-800'}>
        {isExpiring ? (
          <>
            <strong>Atenção:</strong> Sua sessão expira em {timeRemaining}
          </>
        ) : (
          <>Sessão ativa - válida por mais {timeRemaining}</>
        )}
      </AlertDescription>
    </Alert>
  );
}
