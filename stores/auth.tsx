"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type User = { id: string; name: string; email: string } | null;

interface AuthContextValue {
  user: User;
  login: (email: string, _password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('bb_user') : null;
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const login = (email: string) => {
    const mockUser = { id: 'local', name: email.split('@')[0] || 'Guest', email };
    setUser(mockUser);
    localStorage.setItem('bb_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bb_user');
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
