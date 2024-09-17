import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { TokenRequest, TokenResponse } from "./models.js";
import { getTracingHeader } from "../../lib/utils.js";
import { config } from "../../config.js";

export const getAuthToken = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/token/new",
    schema: {
      body: TokenRequest,
      response: {
        200: TokenResponse,
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (request, reply) => {
      const { tracingId, key } = getTracingHeader(request.headers);
      reply.header(key, tracingId);
      const authLogger = fastify.log.child({
        tracingId,
      });
      authLogger.debug("starting to get token");

      try {
        const tokenRequest = {
          grant_type: "authorization_code",
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code: request.body.code,
          code_verifier: request.body.code_verifier,
          redirect_uri: config.redirectUri,
        };

        const tokens = await fetch("https://oauth2.googleapis.com/token", {
          method: "post",
          body: JSON.stringify(tokenRequest),
        });
        const tokensJson = await tokens.json();

        const parsed = TokenResponse.safeParse(tokensJson);
        if (parsed.success) {
          return reply.code(200).send(tokensJson);
        }

        authLogger.error({ parsed }, "Error parsing response");
        return reply.code(400).send({ error: "Error fetching accessToken" });
      } catch (error) {
        authLogger.error({ error }, "Error handling request");
        reply.code(500).send({ error: JSON.stringify(error) });
      }
    },
  });
};
