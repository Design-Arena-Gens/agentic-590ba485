"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'NGN' | 'CAD' | 'AUD' | 'BRL';

export interface SettingsState {
  currency: CurrencyCode;
}

const defaultSettings: SettingsState = {
  currency: 'USD',
};

interface SettingsContextValue extends SettingsState {
  setCurrency: (c: CurrencyCode) => void;
  format: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('bb_settings') : null;
    if (raw) {
      const parsed = JSON.parse(raw) as SettingsState;
      setCurrencyState(parsed.currency);
    }
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('bb_settings', JSON.stringify({ currency: c } satisfies SettingsState));
  };

  const format = (amount: number) => new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);

  const value = useMemo(() => ({ currency, setCurrency, format }), [currency]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
