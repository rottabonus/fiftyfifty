import { z } from "zod";
import { timestampSchema } from "../../lib/commonModels";
import type { ENVIRONMENT } from "../../lib/config";
import { getTracingHeader, getAuthHeader, config } from "../../lib/config";

export const User = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  lastLogin: timestampSchema,
  createdAt: timestampSchema,
});

const UserResponse = z.object({ user: User });

export type User = z.infer<typeof User>;

export const getUser = async (environment: ENVIRONMENT) => {
  const userResponse = await fetch(`${config[environment].baseUrl}/user`, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      ...getTracingHeader(),
      ...getAuthHeader(),
    },
  });
  const userJson = await userResponse.json();

  const parsed = UserResponse.safeParse(userJson);
  if (parsed.success) {
    return parsed.data;
  }

  return null;
};
