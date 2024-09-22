import { z } from "zod";

const Session = z.object({
  id: z.number(),
  userId: z.number(),
  sessionId: z.number(),
  connected: z.boolean(),
});

export const SessionsQueryResult = z.array(Session);
