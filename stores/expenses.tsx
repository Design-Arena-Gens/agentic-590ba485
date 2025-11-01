"use client";

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Category = 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Health' | 'Income' | 'Other';

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number; // positive for expense, negative for income? we'll keep expense positive and track type
  type: 'expense' | 'income';
  category: Category;
  date: string; // ISO date
}

interface ExpenseContextValue {
  items: ExpenseItem[];
  add: (item: Omit<ExpenseItem, 'id'>) => void;
  remove: (id: string) => void;
  clear: () => void;
  totals: { income: number; expense: number; balance: number };
  aiParse: (text: string) => Partial<Omit<ExpenseItem, 'id'>>;
  aiTip: () => string;
}

const ExpenseContext = createContext<ExpenseContextValue | undefined>(undefined);

const STORAGE_KEY = 'bb_items';

const defaultItems: ExpenseItem[] = [];

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ExpenseItem[]>(defaultItems);

  useEffect(() => {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add: ExpenseContextValue['add'] = (item) => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [{ id, ...item }, ...prev]);
  };

  const remove = (id: string) => setItems((prev) => prev.filter((x) => x.id !== id));
  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const income = items.filter(i => i.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = items.filter(i => i.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const balance = income - expense;
    return { income, expense, balance };
  }, [items]);

  // Very simple heuristic parser: "paid $15 for lunch yesterday" -> title=lunch, amount=15, category=Food, date=yesterday
  const aiParse: ExpenseContextValue['aiParse'] = (text) => {
    const lower = text.toLowerCase();
    const amountMatch = /([\$????])?\s*(\d+(?:[\.,]\d{1,2})?)/.exec(text.replace(',', '.'));
    const amount = amountMatch ? parseFloat(amountMatch[2]) : undefined;

    const categories: Record<string, Category> = {
      lunch: 'Food', dinner: 'Food', grocery: 'Food', groceries: 'Food', coffee: 'Food', cafe: 'Food',
      uber: 'Transport', taxi: 'Transport', bus: 'Transport', train: 'Transport', gas: 'Transport', fuel: 'Transport',
      clothes: 'Shopping', amazon: 'Shopping', shoes: 'Shopping',
      rent: 'Bills', internet: 'Bills', electricity: 'Bills', water: 'Bills', phone: 'Bills',
      movie: 'Entertainment', netflix: 'Entertainment', spotify: 'Entertainment', game: 'Entertainment',
      doctor: 'Health', pharmacy: 'Health', gym: 'Health',
      salary: 'Income', bonus: 'Income', refund: 'Income',
    };
    let category: Category | undefined;
    for (const [k, v] of Object.entries(categories)) {
      if (lower.includes(k)) { category = v; break; }
    }

    const type: 'expense' | 'income' = category === 'Income' ? 'income' : 'expense';

    const date = inferDate(lower);

    const title = inferTitle(lower) || 'Quick entry';

    return { amount, category, date, type, title };
  };

  const aiTip = () => {
    const { income, expense, balance } = totals;
    if (income === 0 && expense === 0) return 'Add a few items to get personalized tips.';
    const savingsRate = income > 0 ? (balance / income) : -1;
    if (savingsRate >= 0.2) return 'Great job! You are saving over 20% of your income.';
    if (savingsRate >= 0.1) return 'Nice! Consider automating 5% more to savings every month.';
    if (savingsRate >= 0) return 'Your spending matches income. Set a mini goal to save 5% next month.';
    if (balance < 0 && expense > income) return 'Spending exceeds income. Identify one category to cut by 10%.';
    return 'Track big recurring expenses. Small cuts in "Bills" compound over time.';
  };

  const value: ExpenseContextValue = { items, add, remove, clear, totals, aiParse, aiTip };
  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
}

function inferDate(lower: string): string {
  const now = new Date();
  if (lower.includes('yesterday')) { const d = new Date(now); d.setDate(now.getDate() - 1); return d.toISOString().slice(0,10); }
  if (lower.includes('today')) { return now.toISOString().slice(0,10); }
  const dateMatch = /(\d{4}-\d{2}-\d{2})|(\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4})/.exec(lower);
  if (dateMatch) {
    const s = dateMatch[0].replace(/\./g,'/');
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0,10);
  }
  return now.toISOString().slice(0,10);
}

function inferTitle(lower: string): string | undefined {
  const phrases = ['for ', 'on ', 'at ', 'from '];
  for (const p of phrases) {
    const idx = lower.indexOf(p);
    if (idx !== -1) {
      const tail = lower.slice(idx + p.length).trim();
      const word = tail.split(/[\.,!$]/)[0].trim();
      if (word) return capitalize(word);
    }
  }
  const first = lower.split(/\s+/)[0];
  return first ? capitalize(first) : undefined;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function useExpenses() {
  const ctx = useContext(ExpenseContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpenseProvider');
  return ctx;
}
