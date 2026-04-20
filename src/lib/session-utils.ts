export function getSessionTimeRemaining(expiresAt: Date | null): string {
  if (!expiresAt) return '';

  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();

  if (diff <= 0) return 'Sessão expirada';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} dia${days > 1 ? 's' : ''}`;
  }

  if (hours > 0) {
    return `${hours} hora${hours > 1 ? 's' : ''}`;
  }

  return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
}

export function isSessionExpiringSoon(expiresAt: Date | null): boolean {
  if (!expiresAt) return false;

  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  const hoursRemaining = diff / (1000 * 60 * 60);

  return hoursRemaining < 24 && hoursRemaining > 0;
}

export function formatSessionExpiryDate(expiresAt: Date | null): string {
  if (!expiresAt) return '';

  return expiresAt.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
