import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import '@/styles/globals.css';

const PUBLIC_PAGES = ['/auth', '/'];

// Separate component so it can use useAuth inside AuthProvider
function AppContent({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { firebaseUser, appUser, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const isPublicPage = PUBLIC_PAGES.includes(router.pathname);

    if (!firebaseUser && !isPublicPage) {
      router.replace('/auth');
    } else if (firebaseUser && router.pathname === '/auth') {
      router.replace('/dashboard');
    }
  }, [firebaseUser, loading, router]);

  const isPublicPage = PUBLIC_PAGES.includes(router.pathname);

  return (
    <ThemeProvider>
      {isPublicPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout user={appUser}>
          {loading ? (
            <div className="flex items-center justify-center h-screen">
              <div className="text-gray-500 dark:text-gray-400">Loading...</div>
            </div>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      )}
    </ThemeProvider>
  );
}

export default function App(props: AppProps) {
  return (
    <AuthProvider>
      <AppContent {...props} />
    </AuthProvider>
  );
}
