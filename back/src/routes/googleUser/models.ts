import { z } from "zod";

export const GoogleUser = z.object({
  name: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
});
