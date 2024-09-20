import { z } from "zod";
import { timestampSchema } from "../../lib/commonModels.js";

export const GoogleUser = z.object({
  name: z.string(),
  email: z.string(),
  email_verified: z.boolean(),
  given_name: z.string(),
  family_name: z.string(),
  picture: z.string(),
});

export const User = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  lastLogin: timestampSchema,
  createdAt: timestampSchema,
});

export const UserResponse = z.object({
  user: User,
});

export const UserQueryResult = z.array(User);
