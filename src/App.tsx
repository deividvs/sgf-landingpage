import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { OnboardingScreen } from './components/Onboarding/OnboardingScreen';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm';
import { Dashboard } from './components/Dashboard/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && !user) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleCompleteOnboarding} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center p-4">
        {authView === 'login' && (
          <LoginForm
            onToggleForm={() => setAuthView('signup')}
            onForgotPassword={() => setAuthView('forgot')}
          />
        )}
        {authView === 'signup' && (
          <SignUpForm onToggleForm={() => setAuthView('login')} />
        )}
        {authView === 'forgot' && (
          <ForgotPasswordForm onBack={() => setAuthView('login')} />
        )}
      </div>
    );
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
