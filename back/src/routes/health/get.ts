import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { HealthResponse, Select1Response } from "./models.js";
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

      const pgConnection = await fastify.pgQuery({
        query: "select 1 as success;",
        model: Select1Response,
        values: [],
        traceLogger: healthLogger,
      });

      const pgHealthiness = {
        healthy: pgConnection.isOk,
        ...(!pgConnection.isOk && { error: JSON.stringify(pgConnection.data) }),
      };

      try {
        return reply
          .code(200)
          .send({ up, memory, pgConnection: pgHealthiness });
      } catch (error) {
        healthLogger.error({ error }, "Error handling request");
        reply.code(500).send({ error: JSON.stringify(error) });
      }
    },
  });
};
