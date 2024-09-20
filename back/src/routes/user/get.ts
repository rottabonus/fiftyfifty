import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UserQueryResult, UserResponse } from "./models.js";
import { getTracingHeader, getToken } from "../../lib/utils.js";
import { getGoogleUserInfo } from "../../lib/getGoogleUserInfo.js";

export const getUser = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/user",
    schema: {
      response: {
        200: UserResponse,
        404: z.object({ message: z.string() }),
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (request, reply) => {
      const { tracingId, key } = getTracingHeader(request.headers);
      reply.header(key, tracingId);
      const userLogger = fastify.log.child({
        tracingId,
      });
      userLogger.info("Starting to handle getUser-request");

      try {
        const accessToken = getToken(request.headers);
        const parsed = await getGoogleUserInfo(accessToken);

        if (!parsed.success) {
          userLogger.error({ error: parsed.error }, "Error parsing userJson");
          return reply.code(400).send({ error: "validation error" });
        }

        const query = `SELECT * from users WHERE email = $1`;
        const userResult = await fastify.pgQuery({
          query,
          values: [parsed.data.email],
          model: UserQueryResult,
          traceLogger: userLogger,
        });

        // if erroneous reult
        if (!userResult.isOk) {
          userLogger.error({ error: parsed.error }, "Error parsing userJson");
          return reply
            .code(400)
            .send({ error: "Error querying data from database" });
        }

        // if no user found
        if (userResult.data.length === 0) {
          userLogger.error(`No user found with email "${parsed.data.email}"`);
          return reply.code(404).send({ message: "No user found" });
        }

        return reply.code(200).send({ user: userResult.data[0] });
      } catch (error) {
        userLogger.error({ error }, "Error handling request");
        reply.code(500).send({ error: JSON.stringify(error) });
      }
    },
  });
};
