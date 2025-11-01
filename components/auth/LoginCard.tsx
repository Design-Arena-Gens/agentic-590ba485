"use client";

import { useAuth } from '@/stores/auth';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function LoginCard() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'guest@example.com', password);
    router.push('/dashboard');
  };

  const guest = () => {
    login('guest@example.com', '');
    router.push('/dashboard');
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Welcome back</h1>
        <p className="text-sm opacity-70">Minimalist budget tracker with a glassy vibe.</p>
      </div>
      <div className="space-y-3">
        <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <button className="btn-primary w-full" type="submit">Login <ArrowRight className="ml-2" size={16}/></button>
        <button className="btn-ghost" type="button" onClick={guest}>Guest</button>
      </div>
    </form>
  );
}
