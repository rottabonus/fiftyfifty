import { z } from "zod";
import { timestampSchema } from "../../lib/commonModels.js";

const User = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  createdAt: timestampSchema,
  lastLogin: timestampSchema,
});

export const UsersQueryResult = z.array(User);

export const UsersResponse = z.object({ users: UsersQueryResult });
