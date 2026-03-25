'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        router.push('/dashboard');
      }
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      setEmail('');
      setPassword('');
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Auth failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setMessage(null);
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : 'Sign out failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-blue-50/60 to-white dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-950 flex flex-col">
      {/* Decorative orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-blue-200/40 to-transparent dark:from-blue-800/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            T
          </div>
          TimeTracker
        </Link>
      </header>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-blue-100 dark:border-blue-900/40 shadow-xl shadow-blue-900/5 p-8">

            {user ? (
              <>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">You&apos;re signed in</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Redirecting to your dashboard…</p>
                <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-slate-700/50 p-4 text-sm mb-6">
                  <div className="font-medium text-slate-900 dark:text-slate-100 mb-0.5">Signed in as</div>
                  <div className="text-slate-500 dark:text-slate-400 break-all text-xs font-mono">{user.email}</div>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 border border-blue-200 dark:border-slate-600 hover:bg-blue-50 dark:hover:bg-slate-700 disabled:opacity-60 transition-colors"
                >
                  {loading ? 'Signing out…' : 'Sign out'}
                </button>
              </>
            ) : (
              <>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  {mode === 'signin' ? 'Welcome back' : 'Create an account'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                  {mode === 'signin'
                    ? 'Sign in to your TimeTracker dashboard.'
                    : 'Start tracking time for free — no card needed.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-blue-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
                      placeholder="you@company.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-blue-200 dark:border-slate-600 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 dark:bg-slate-700/50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 transition"
                      placeholder="At least 6 characters"
                      minLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm rounded-xl shadow-sm shadow-blue-500/20 transition-colors"
                  >
                    {loading
                      ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                      : mode === 'signin' ? 'Sign in' : 'Create account'}
                  </button>
                </form>

                {message && (
                  <div className="mt-4 text-xs text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
                    {message}
                  </div>
                )}

                <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
                  {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    type="button"
                    onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(null); }}
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {mode === 'signin' ? 'Sign up free' : 'Sign in'}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
