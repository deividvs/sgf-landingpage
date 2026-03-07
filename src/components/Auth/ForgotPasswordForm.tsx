import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Props = {
  onBack: () => void;
};

export function ForgotPasswordForm({ onBack }: Props) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Senha redefinida!</h2>
              <p className="text-muted-foreground mb-6">
                Sua senha foi redefinida com sucesso.
              </p>
              <Button onClick={onBack} className="w-full">
                Voltar para login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <Card>
        <CardHeader>
          <Button
            variant="ghost"
            onClick={onBack}
            className="w-fit px-0 mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <CardTitle className="text-3xl">Esqueceu sua senha?</CardTitle>
          <CardDescription>
            Informe seu e-mail e defina uma nova senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Redefinindo...' : 'Redefinir senha'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
