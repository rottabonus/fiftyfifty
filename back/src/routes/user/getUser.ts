import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { User, UserRequest } from "./models.js";
import { newUid } from "../../lib/utils.js";
import { config } from "../../config.js";

export const getUser = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/user",
    schema: {
      body: UserRequest,
      response: {
        200: User,
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (request, reply) => {
      const userLogger = fastify.log.child({
        tracingId: `user-${newUid()}`,
      });

      userLogger.info("Starting to handle getUser-request");

      try {
        const tokenRequest = {
          grant_type: "authorization_code",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: request.body.code,
          redirect_uri: config.redirectUri,
        };

        const tokens = await fetch("https://oauth2.googleapis.com/token", {
          method: "post",
          body: JSON.stringify(tokenRequest),
        });

        const tokensJson = await tokens.json();

        const userInfo = await fetch(
          "https://openidconnect.googleapis.com/v1/userinfo",
          {
            method: "post",
            headers: { Authorization: `Bearer ${tokensJson.access_token}` },
          },
        );

        userLogger.debug(userInfo, "got user");

        const userJson = await userInfo.json();
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
