import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { Tasks, TasksQueryResult } from "./models.js";
import { newUid } from "../../lib/utils.js";

export const getTasks = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/tasks",
    schema: {
      response: {
        200: Tasks,
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (_request, reply) => {
      const tasksLogger = fastify.log.child({
        tracingId: `tasks-${newUid()}`,
      });

      tasksLogger.info("Starting to handle getTasks-request");

      try {
        const query = "select * from tasks";

        const tasksResult = await fastify.pgQuery({
          query,
          model: TasksQueryResult,
          values: [],
          traceLogger: tasksLogger,
        });
        if (tasksResult.isOk) {
          return reply.code(200).send({ tasks: tasksResult.data });
        }

        return reply
          .code(400)
          .send({ error: "Error querying data from database" });
      } catch (error) {
        tasksLogger.error({ error }, "Error handling request");
        reply.code(500).send({ error: JSON.stringify(error) });
      }
    },
  });
};
