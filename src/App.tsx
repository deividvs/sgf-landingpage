import { useState } from 'react';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'forgot-password';

function App() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {authView === 'login' && (
          <LoginForm
            onToggleForm={() => setAuthView('signup')}
            onForgotPassword={() => setAuthView('forgot-password')}
          />
        )}
        {authView === 'signup' && (
          <SignUpForm onToggleForm={() => setAuthView('login')} />
        )}
        {authView === 'forgot-password' && (
          <ForgotPasswordForm onBack={() => setAuthView('login')} />
        )}
      </div>
    </div>
  );
}

export default App;
