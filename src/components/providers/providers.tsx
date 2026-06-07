/**
 * Providers applicatifs globaux.
 * Centralise React Query et le système de toasts (sonner)
 * pour qu'ils soient disponibles dans toute l'arborescence.
 */

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from 'sonner';


export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      {children}
    </QueryClientProvider>
  );
}
