'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
      const errorMessage = error instanceof Error ? error.message : 'Auth failed.';
      setMessage(errorMessage);
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
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Account</h1>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
          {user ? 'You are signed in.' : 'Sign in or create an account.'}
        </p>

        {user ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-3 text-sm">
              <div className="font-medium text-gray-900 dark:text-gray-100">Signed in as</div>
              <div className="text-gray-800 dark:text-gray-300 break-all font-mono text-xs mt-1">{user.email ?? 'Unknown email'}</div>
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-2">UID: {user.uid}</div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={loading}
              className="w-full bg-gray-900 dark:bg-gray-700 text-white py-2 rounded-lg hover:bg-black dark:hover:bg-gray-600 disabled:opacity-60 transition"
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {loading
                ? mode === 'signin'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {mode === 'signin'
                ? 'Need an account? Create one'
                : 'Already have an account? Sign in'}
            </button>
          </form>
        )}

        {message && (
          <div className="mt-4 text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800">{message}</div>
        )}
      </div>
    </div>
  );
}
