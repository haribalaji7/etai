'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '@/store/store';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000, retry: 1 } },
  }));

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#16161f', color: '#f0f0ff', border: '1px solid rgba(255,255,255,0.07)' },
            success: { icon: '✅', style: { background: '#0d2b1e', color: '#4ade80' } },
            error: { icon: '❌', style: { background: '#2b0d0d', color: '#f87171' } },
          }}
        />
      </QueryClientProvider>
    </ReduxProvider>
  );
}
