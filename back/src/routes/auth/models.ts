import { z } from "zod";

export const AuthUrlResponse = z.object({
  code_verifier: z.string(),
  auth_url: z.string(),
});

export const AuthUrlRequest = z.object({
  redirect_uri: z.string(),
});

export const TokenResponse = z.object({
  access_token: z.string(),
  scope: z.string(),
  token_type: z.literal("Bearer"),
  expires_in: z.number(),
});

export const TokenRequest = z.object({
  code: z.string(),
  code_verifier: z.string(),
});
