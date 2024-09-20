import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { GoogleUser } from "./models.js";
import { getTracingHeader, getToken } from "../../lib/utils.js";
import { getGoogleUserInfo } from "../../lib/getGoogleUserInfo.js";

export const getGoogleUser = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/user",
    schema: {
      response: {
        200: GoogleUser,
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (request, reply) => {
      const { tracingId, key } = getTracingHeader(request.headers);
      reply.header(key, tracingId);
      const userLogger = fastify.log.child({
        tracingId,
      });
      userLogger.info("Starting to handle getGoogleUser-request");

      try {
        const accessToken = getToken(request.headers);
        const parsed = await getGoogleUserInfo(accessToken);

        if (parsed.success) {
          return reply.code(200).send(parsed.data);
        }

        userLogger.error(parsed.error, "Error parsing userJson");
        return reply.code(400).send({ error: "validation error" });
      } catch (error) {
        userLogger.error({ error }, "Error handling request");
        reply.code(500).send({ error: JSON.stringify(error) });
      }
    },
  });
};
