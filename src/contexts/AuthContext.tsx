import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { localStorageService, User } from '../lib/localStorage';

type AuthError = {
  message: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorageService.auth.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const user = localStorageService.auth.signUp(email, password);
      setUser(user);
      return { data: { user }, error: null };
    } catch (err) {
      return { data: null, error: { message: (err as Error).message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const user = localStorageService.auth.signIn(email, password);
      setUser(user);
      return { error: null };
    } catch (err) {
      return { error: { message: (err as Error).message } };
    }
  };

  const signOut = async () => {
    localStorageService.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const newPassword = prompt('Digite a nova senha:');
      if (!newPassword) {
        return { error: { message: 'Senha não fornecida' } };
      }
      localStorageService.auth.resetPassword(email, newPassword);
      return { error: null };
    } catch (err) {
      return { error: { message: (err as Error).message } };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
