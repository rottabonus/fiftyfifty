import { z } from "zod";
import type { ENVIRONMENT } from "../../../lib/config";
import { config, getTracingHeader } from "../../../lib/config";

const AuthUrlResponse = z.object({
  code_verifier: z.string(),
  auth_url: z.string(),
  tracing: z.string(),
});

export const getAuthUrl = async (environment: ENVIRONMENT) => {
  const authResponse = await fetch(
    `${config[environment].baseUrl}/auth/url/generate`,
    {
      method: "POST",
      headers: {
        ...getTracingHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        redirect_uri: config[environment].redirectUri,
      }),
    },
  );
  const authJson = await authResponse.json();

  const parsed = AuthUrlResponse.safeParse(authJson);
  if (parsed.success) {
    sessionStorage.setItem("code_verifier", parsed.data.code_verifier);
    sessionStorage.setItem("auth_tracing", parsed.data.tracing);
    window.location.href = parsed.data.auth_url;
  }

  console.error(parsed.error);
  return null;
};
