"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { IdiomaProvider } from "@/components/lang-provider";
import { CarritoProvider } from "@/components/cart-provider";
import { Toaster } from "@/components/ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1, refetchOnWindowFocus: false },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <IdiomaProvider>
        <CarritoProvider>
          {children}
          <Toaster position="top-right" closeButton richColors />
        </CarritoProvider>
      </IdiomaProvider>
    </QueryClientProvider>
  );
}
