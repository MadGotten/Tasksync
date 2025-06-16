import { authenticate, client, keycloak } from "@/api/keycloak";
import { router } from "@/router";
import { AuthState } from "@/types/auth";
import { useState } from "react";
import { flushSync } from "react-dom";

export type AuthContext = AuthState & {
  ensureInitialized: () => Promise<AuthState>;
};

export const useAuth = (): AuthContext => {
  const [auth, setAuth] = useState<AuthState>({
    isInitialized: false,
    isAuthenticated: false,
    user: undefined,
    authLoading: false,
  });

  keycloak.onTokenExpired = () => {
    keycloak.updateToken(5);
  };

  keycloak.onReady = () => {
    flushSync(() => {
      setAuth((auth) => ({
        ...auth,
        isInitialized: true,
      }));
    });
    router.invalidate();
  };

  keycloak.onAuthError = () => {
    flushSync(() => {
      setAuth((auth) => ({
        ...auth,
        isInitialized: true,
      }));
    });
    router.invalidate();
  };

  keycloak.onAuthSuccess = async () => {
    setAuth((auth) => ({
      ...auth,
      authLoading: true,
    }));
    await keycloak.loadUserProfile().then((profile) => {
      flushSync(() => {
        setAuth({
          isAuthenticated: true,
          isInitialized: true,
          user: {
            username: profile?.username || "",
            email: profile?.email || "",
            picture: (profile?.attributes?.picture as string) || "",
          },
          authLoading: false,
        });
        authenticate();
      });
    });
    router.invalidate();
  };

  const ensureInitialized = async () => {
    if (!auth.isInitialized) {
      await client();
    }
    return auth;
  };

  return { ...auth, ensureInitialized };
};
