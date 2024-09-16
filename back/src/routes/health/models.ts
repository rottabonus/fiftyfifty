import { z } from "zod";

// const Health = z.object({
//   healthy: z.boolean(),
//   error: z.string().optional(),
// });

const Memory = z.object({
  rss: z.number(),
  heapTotal: z.number(),
  heapUsed: z.number(),
  external: z.number(),
  arrayBuffers: z.number(),
});

export const HealthResponse = z.object({
  up: z.number(),
  memory: Memory,
});
