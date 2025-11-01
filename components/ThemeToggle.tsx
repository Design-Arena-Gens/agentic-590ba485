"use client";

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';
  const toggle = () => setTheme(isDark ? 'light' : 'dark');

  return (
    <button onClick={toggle} className="btn-ghost" aria-label="Toggle theme">
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
