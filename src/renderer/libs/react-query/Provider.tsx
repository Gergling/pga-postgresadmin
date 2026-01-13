import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      // retry: false,
    },
  },
});

export const AppQueryProvider = ({ children }: PropsWithChildren) =>
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
