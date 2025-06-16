export interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user?: { username: string; email: string; picture: string };
  authLoading: boolean;
}
