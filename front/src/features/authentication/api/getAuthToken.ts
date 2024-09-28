import { z } from "zod";
import type { ENVIRONMENT } from "../../../lib/config";
import { config, getTracingHeader } from "../../../lib/config";

const AuthTokenResponse = z.object({
  access_token: z.string(),
});

export const getAuthToken = async (code: string, environment: ENVIRONMENT) => {
  const code_verifier = sessionStorage.getItem("code_verifier");
  const tracing = sessionStorage.getItem("auth_tracing");
  const tokenResponse = await fetch(
    `${config[environment].baseUrl}/auth/token/new`,
    {
      method: "POST",
      headers: {
        ...getTracingHeader(tracing),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        code_verifier,
      }),
    },
  );
  const tokenJson = await tokenResponse.json();

  const parsed = AuthTokenResponse.safeParse(tokenJson);
  if (parsed.success) {
    sessionStorage.setItem("access_token", parsed.data.access_token);
    sessionStorage.removeItem("code_verifier");
    sessionStorage.removeItem("auth_tracing");
    return { isAuthenticated: true, status: tokenResponse.status };
  }

  console.error(parsed.error);
  return { isAuthenticated: false, status: tokenResponse.status };
};
