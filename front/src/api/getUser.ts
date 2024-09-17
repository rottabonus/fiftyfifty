import { z } from "zod";
import { getTracingHeader, getAccessToken } from "../lib/config";

export const User = z.object({
  name: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
});

export type User = z.infer<typeof User>;

export const getUser = async () => {
  const userResponse = await fetch("http://localhost:3000/user", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
      ...getTracingHeader(),
      ...getAccessToken(),
    },
  });
  const userJson = await userResponse.json();

  const parsed = User.safeParse(userJson);
  if (parsed.success) {
    return parsed.data;
  }

  return null;
};
