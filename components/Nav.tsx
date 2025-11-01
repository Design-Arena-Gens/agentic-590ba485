"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/stores/auth';

export default function Nav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={user ? '/dashboard' : '/'} className="font-semibold">Budget Blur</Link>
          {user && (
            <nav className="hidden sm:flex items-center gap-3 text-sm">
              <Link className={linkCls(pathname === '/dashboard')} href="/dashboard">Dashboard</Link>
              <Link className={linkCls(pathname === '/settings')} href="/settings">Settings</Link>
            </nav>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <button onClick={logout} className="btn-ghost text-sm">Logout</button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function linkCls(active: boolean) {
  return `px-3 py-1.5 rounded-md ${active ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-black/5 dark:hover:bg-white/10'}`;
}
