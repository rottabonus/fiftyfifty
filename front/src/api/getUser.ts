import { z } from "zod";
import { commonHeaders } from "../lib/config";

export const User = z.object({
  name: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
});

export type User = z.infer<typeof User>;

export const getUser = async (code: string) => {
  const userResponse = await fetch("http://localhost:3000/user", {
    method: "post",
    headers: { "Content-Type": "application/json", ...commonHeaders },
    body: JSON.stringify({ code }),
  });
  const userJson = await userResponse.json();

  const parsed = User.safeParse(userJson);
  if (parsed.success) {
    return parsed.data;
  }

  return null;
};
