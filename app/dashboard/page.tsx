"use client";

import Nav from '@/components/Nav';
import { useAuth } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useExpenses, type Category } from '@/stores/expenses';
import { useSettings } from '@/stores/settings';
import { Plus, Brain, X, Info } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/');
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="container space-y-6">
      <Nav />
      <Overview />
      <div className="grid md:grid-cols-3 gap-6">
        <QuickAdd />
        <AiAdd />
        <Tips />
      </div>
      <ItemsTable />
    </div>
  );
}

function Overview() {
  const { totals } = useExpenses();
  const { format } = useSettings();

  return (
    <section className="grid sm:grid-cols-3 gap-4">
      <div className="card"><h3 className="text-sm opacity-70">Income</h3><p className="text-2xl font-semibold">{format(totals.income)}</p></div>
      <div className="card"><h3 className="text-sm opacity-70">Expenses</h3><p className="text-2xl font-semibold">{format(totals.expense)}</p></div>
      <div className="card"><h3 className="text-sm opacity-70">Balance</h3><p className="text-2xl font-semibold">{format(totals.balance)}</p></div>
    </section>
  );
}

function QuickAdd() {
  const { add } = useExpenses();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState<Category>('Food');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    add({ title, amount: Math.abs(amount), type, category, date: new Date().toISOString().slice(0,10) });
    setTitle(''); setAmount(0);
  };

  return (
    <section className="card space-y-3">
      <h3 className="font-semibold">Quick add</h3>
      <form onSubmit={submit} className="grid grid-cols-2 gap-2">
        <input className="input col-span-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} />
        <select className="input" value={type} onChange={(e)=>setType(e.target.value as any)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input className="input" type="number" step="0.01" placeholder="Amount" value={amount || ''} onChange={(e)=>setAmount(parseFloat(e.target.value)||0)} />
        <select className="input col-span-2" value={category} onChange={(e)=>setCategory(e.target.value as Category)}>
          {['Food','Transport','Shopping','Bills','Entertainment','Health','Income','Other'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn-primary col-span-2" type="submit"><Plus className="mr-2" size={16}/>Add</button>
      </form>
    </section>
  );
}

function AiAdd() {
  const { aiParse, add } = useExpenses();
  const [text, setText] = useState('Paid $12 for lunch yesterday');

  const go = () => {
    const p = aiParse(text);
    if (!p.amount || !p.title || !p.type || !p.category || !p.date) return;
    add({ title: p.title, amount: p.amount, type: p.type, category: p.category, date: p.date });
    setText('');
  };

  return (
    <section className="card space-y-3">
      <h3 className="font-semibold flex items-center gap-2"><Brain size={16}/> AI add</h3>
      <textarea className="input min-h-24" value={text} onChange={(e)=>setText(e.target.value)} placeholder="E.g. 'Uber $23 yesterday'" />
      <button className="btn-ghost" onClick={go}>Parse and add</button>
    </section>
  );
}

function Tips() {
  const { aiTip } = useExpenses();
  return (
    <section className="card space-y-2">
      <h3 className="font-semibold flex items-center gap-2"><Info size={16}/> Insights</h3>
      <p className="text-sm opacity-80">{aiTip()}</p>
    </section>
  );
}

function ItemsTable() {
  const { items, remove } = useExpenses();
  const { format } = useSettings();

  const grouped = useMemo(() => items.reduce((acc, it) => {
    const d = it.date; (acc[d] ||= []).push(it); return acc;
  }, {} as Record<string, typeof items>), [items]);

  const dates = Object.keys(grouped).sort((a,b)=> b.localeCompare(a));

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Recent items</h3>
      </div>
      <div className="space-y-4">
        {dates.length === 0 && <p className="text-sm opacity-70">No items yet.</p>}
        {dates.map(date => (
          <div key={date}>
            <div className="text-xs uppercase opacity-60 mb-1">{date}</div>
            <ul className="divide-y divide-white/20">
              {grouped[date].map(it => (
                <li key={it.id} className="py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${it.type==='income'?'bg-green-500/20 text-green-700 dark:text-green-300':'bg-red-500/20 text-red-700 dark:text-red-300'}`}>{it.type}</span>
                    <div>
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs opacity-70">{it.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`font-semibold ${it.type==='income'?'text-green-600 dark:text-green-400':'text-red-600 dark:text-red-400'}`}>
                      {it.type==='income' ? '+' : '-'}{format(it.amount)}
                    </div>
                    <button className="btn-ghost" onClick={() => remove(it.id)} aria-label="Remove"><X size={14}/></button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
