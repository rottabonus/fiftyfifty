import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { Task, Tasks, TasksQueryResult } from "./models.js";
import { getTracingHeader } from "../../lib/utils.js";

export const putTask = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "PUT",
    url: "/task/:id",
    schema: {
      body: Task,
      params: z.object({ id: z.coerce.number() }),
      response: {
        200: Tasks,
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (request, reply) => {
      const { tracingId, key } = getTracingHeader(request.headers);
      reply.header(key, tracingId);
      const tasksLogger = fastify.log.child({
        tracingId,
      });
      const { id } = request.params;
      const { name, assigneeId, createdAt, dueDate, comment, done } =
        request.body;

      tasksLogger.info("Starting to handle putTask-request");

      try {
        const query = `
          UPDATE tasks
          SET name = $1, assigneeId = $2, "createdAt" = $3, "dueDate" = $4, comment = $5, done = $6
          WHERE id = $7
          RETURNING id, name, assigneeId, "createdAt", "dueDate", done;
        `;

        const taskResult = await fastify.pgQuery({
          query,
          model: TasksQueryResult,
          values: [name, assigneeId, createdAt, dueDate, comment, done, id],
          traceLogger: tasksLogger,
        });
        if (taskResult.isOk) {
          return reply.code(200).send({ tasks: taskResult.data });
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
