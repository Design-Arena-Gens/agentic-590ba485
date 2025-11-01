"use client";

import { AuthProvider } from '@/stores/auth';
import { ExpenseProvider } from '@/stores/expenses';
import { SettingsProvider } from '@/stores/settings';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ExpenseProvider>
          {children}
        </ExpenseProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
