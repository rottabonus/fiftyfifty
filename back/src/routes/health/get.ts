import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { HealthResponse } from "./models.js";
import { newUid } from "../../lib/utils.js";

export const getHealth = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/healthz",
    schema: {
      response: {
        200: HealthResponse,
        400: HealthResponse,
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (_request, reply) => {
      const healthLogger = fastify.log.child({
        tracingId: `health-${newUid()}`,
      });
      const up = process.uptime();
      const memory = { ...process.memoryUsage() };

      try {
        return reply.code(200).send({ up, memory });
      } catch (error) {
        healthLogger.error({ error }, "Error handling request");
        reply.code(500).send({ error: JSON.stringify(error) });
      }
    },
  });
};
