export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_APP_BASE_URL ?? "http://localhost:3000";

export const KEYCLOAK_REALM =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "myrealm";

export const KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "myclient";

export const KEYCLOAK_AUTH_URL =
  process.env.NEXT_PUBLIC_KEYCLOAK_AUTH_URL ??
  `http://localhost:9090/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`;

export function getKeycloakLoginUrl(): string {
  const redirectUri = `${API_BASE_URL}/auth/oidc-callback`;
  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid",
  });
  return `${KEYCLOAK_AUTH_URL}?${params.toString()}`;
}
