import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { SignUpForm } from './components/Auth/SignUpForm';
import { ForgotPasswordForm } from './components/Auth/ForgotPasswordForm';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Skeleton } from './components/ui/skeleton';
import { SubscriptionGate } from './components/Subscription/SubscriptionGate';
import { OnboardingScreen } from './components/Onboarding/OnboardingScreen';

function AppContent() {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('signup');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && !user) {
      setShowOnboarding(true);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4 p-6 border rounded-xl bg-white">
                  <div className="flex justify-between">
                    <Skeleton className="w-14 h-14 rounded-xl" />
                    <Skeleton className="w-8 h-8 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showOnboarding) {
      return (
        <OnboardingScreen
          onComplete={() => {
            localStorage.setItem('hasSeenOnboarding', 'true');
            setShowOnboarding(false);
            setAuthView('signup');
          }}
        />
      );
    }

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

  return (
    <SubscriptionGate>
      <Dashboard />
    </SubscriptionGate>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
