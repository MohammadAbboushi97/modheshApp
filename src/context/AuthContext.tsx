import React, {createContext, useContext, useMemo, useState} from 'react';

export type Gender = 'male' | 'female';

export type User = {
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: Gender;
  birthday?: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  authError: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (changes: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type Props = {
  children: React.ReactNode;
};

export const AuthProvider = ({children}: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    if (!username.trim() || !password.trim()) {
      setAuthError('Please enter both username and password.');
      return false;
    }

    setIsLoading(true);
    setAuthError(null);

    try {
      // Mocked auth while backend is not ready.
      await new Promise(resolve => setTimeout(resolve, 900));
      setUser({username: username.trim()});
      return true;
    } catch (err) {
      setAuthError('Unable to sign in right now. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAuthError(null);
  };

  const updateProfile = (changes: Partial<User>) => {
    setUser(prev => (prev ? {...prev, ...changes} : prev));
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      authError,
      login,
      logout,
      updateProfile,
    }),
    [user, isLoading, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return ctx;
};
