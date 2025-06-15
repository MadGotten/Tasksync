import { AuthContext } from "@/hooks/useAuth";
import { QueryClient } from "@tanstack/react-query";

export interface RootRouterContext {
  auth: AuthContext;
  queryClient: QueryClient;
}
