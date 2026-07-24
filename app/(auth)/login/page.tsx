"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../../../services/auth.service';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await AuthService.loginWithCredentials(email, password);
      
      if (res?.error) {
        setError('Invalid credentials. Try user@example.com, admin@example.com, or superadmin@example.com.');
      } else {
        // Fetch session to determine role
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        if (session?.user?.role === 'superadmin') {
          router.push('/superadmin');
        } else if (session?.user?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex antialiased items-center justify-center">
      {/* Left Side: Hero Image Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface-container-low items-center justify-center relative overflow-hidden p-stack-lg h-screen">
        <div className="relative z-10 w-full h-full flex flex-col p-stack-lg">
          <div className="bg-surface-container-lowest/80 backdrop-blur-md px-stack-lg py-stack-md rounded-full w-fit font-bold text-on-surface-variant border border-outline-variant/30 absolute top-stack-lg left-stack-lg z-20">Crextio</div>
          <div className="relative flex-grow flex items-center justify-center mt-section-gap">
            <div className="w-full aspect-[4/3] rounded-[2rem] shadow-2xl border border-outline-variant/20 overflow-hidden relative group">
              <img alt="AI Software Workspace" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPFF_z-Jj0aTMZvZLDXsgqJhFE5pfHaeNHzUvA_PsTUuilj3MFkgxXvOb8Pm4xniLPh4_78LUIJ6eg9lxyEAIOLDKzChcIttZwHiJlNMHE8OU7qR5GOCe7IW3GFDqc-N3kYwo0Rhv2eGEFNPwWcaiwWwMKALg0_nq6-Y916U_Sflwm19xO1DA5JCV64_pehFzNHt9lUJoHcek2WT9otxR7NZef16yd0WRK4PSf3twE-tv_Q6G6jGRafU5XwJr3RMWJyssB4m4hUaNQ" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 bg-surface-bright flex items-center justify-center relative overflow-hidden p-stack-lg h-screen">
        <div className="w-full max-w-md p-stack-lg relative">
          <div className="flex items-center gap-stack-md mb-stack-lg">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <h1 className="font-headline-md text-primary">AI Console</h1>
          </div>
          
          <div className="mb-stack-lg">
            <h2 className="font-headline-xl text-on-surface mb-stack-sm text-4xl font-bold">Sign In</h2>
            <p className="font-body-md text-on-surface-variant">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-error text-sm font-bold bg-error-container p-3 rounded-lg">{error}</div>}
            
            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-bold" htmlFor="email">Email Address</label>
              <input 
                id="email" 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container border-none rounded-xl px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/10 outline-none" 
                placeholder="user@example.com" 
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs font-bold" htmlFor="password">Password</label>
              <input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-container border-none rounded-xl px-4 py-3 font-body-md text-on-surface focus:ring-2 focus:ring-primary/10 outline-none" 
                placeholder="••••••••" 
              />
            </div>

            <button disabled={isLoading} type="submit" className="w-full bg-secondary-container text-on-secondary-container font-bold py-3 mt-4 rounded-xl hover:bg-secondary-fixed transition-all shadow-md active:scale-[0.98]">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-outline-variant/30"></div>
            <span className="px-4 font-label-sm text-on-surface-variant text-xs font-bold">or continue with</span>
            <div className="flex-grow border-t border-outline-variant/30"></div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => handleOAuthLogin('google')} type="button" className="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-label-md py-3 rounded-xl hover:bg-surface-container transition-all shadow-sm">
              <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDweGmG93v8E63Y5JAU105ojRrR3Sgb2KToCXct0DcFL79OQKFX8nUKQMfrN5COiPDCgSQ2ywsLdDZL-FkOsFhAScDdc0-piyWNCdjt4EQDC355fNUCujxucH0pkviFgHQnGcRaKybnZh4T27G49QqKX6jjqxKLdCtuiohbOgTMi6WCy7HJ7FoLSzeE-OkIjrpK8z84m-AsLbqDksOaqhF_Inp50fwKhJxYbBZOhZfRIqEkNiBYxVTD" />
              Google
            </button>
            <button onClick={() => handleOAuthLogin('github')} type="button" className="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-outline-variant/20 text-on-surface font-label-md py-3 rounded-xl hover:bg-surface-container transition-all shadow-sm">
              GitHub
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="font-body-sm text-on-surface-variant">
              Need access? {' '}
              <button 
                onClick={() => router.push('/request-access')} 
                className="font-bold text-primary hover:underline"
              >
                Request Credentials
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
