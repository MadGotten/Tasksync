import Keycloak from "keycloak-js";

const BASE_URL = import.meta.env.VITE_API_URL;

export const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export const client = async () => {
  if (typeof window !== "undefined") {
    await keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      silentCheckSsoFallback: true,
      pkceMethod: "S256",
    });
  }

  return keycloak;
};

export const authenticate = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/users/authenticate`, {
    credentials: "include",
    headers: {
      Authorization: `Bearer ${keycloak.token}`,
    },
  });
  return response.json();
};
