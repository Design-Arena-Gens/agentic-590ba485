"use client";

import Nav from '@/components/Nav';
import { useAuth } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSettings, type CurrencyCode } from '@/stores/settings';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => { if (!user) router.replace('/'); }, [user, router]);
  if (!user) return null;

  return (
    <div className="container space-y-6">
      <Nav />
      <section className="card max-w-xl">
        <h3 className="font-semibold mb-4">Preferences</h3>
        <CurrencySelector />
      </section>
    </div>
  );
}

function CurrencySelector() {
  const { currency, setCurrency } = useSettings();
  const codes: CurrencyCode[] = ['USD','EUR','GBP','JPY','INR','NGN','CAD','AUD','BRL'];

  return (
    <div className="space-y-2">
      <label className="text-sm opacity-70">Currency</label>
      <select value={currency} onChange={(e)=>setCurrency(e.target.value as CurrencyCode)} className="input">
        {codes.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <p className="text-xs opacity-60">Used for formatting amounts across the app.</p>
    </div>
  );
}
