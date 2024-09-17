import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { User } from "./models.js";
import { getTracingHeader, getToken } from "../../lib/utils.js";

export const getUser = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "GET",
    url: "/user",
    schema: {
      response: {
        200: User,
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (request, reply) => {
      const { tracingId, key } = getTracingHeader(request.headers);
      reply.header(key, tracingId);
      const userLogger = fastify.log.child({
        tracingId,
      });
      const accessToken = getToken(request.headers);
      const userInfoUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`;

      userLogger.info("Starting to handle getUser-request");
      userLogger.debug(userInfoUrl, "Created userinfo-url");

      try {
        const userInfo = await fetch(userInfoUrl);

        const userJson = await userInfo.json();
        userLogger.debug(userJson, "got user");

        const parsed = User.safeParse(userJson);
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
