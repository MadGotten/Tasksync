import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { AuthContext } from "@/hooks/useAuth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
      retry: 1,
      retryDelay: 2000,
    },
  },
});

function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      auth: undefined as unknown as AuthContext,
      queryClient: queryClient,
    },

    defaultPendingMinMs: 0,
    defaultPendingMs: 0,
  });

  return router;
}

export const router = createRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
