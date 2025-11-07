'use client';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useAuthStore from '@/store/authStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const queryClient = new QueryClient();

export default function RootLayout({ children }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <QueryClientProvider client={queryClient}>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </QueryClientProvider>
      </body>
    </html>
  );
}
