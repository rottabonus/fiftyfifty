import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { AuthUrlRequest, AuthUrlResponse } from "./models.js";
import { base64URLEncode, getTracingHeader } from "../../lib/utils.js";
import crypto from "crypto";
import { config } from "../../config.js";

export const getAuthUrl = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/url/generate",
    schema: {
      body: AuthUrlRequest,
      response: {
        200: AuthUrlResponse,
        400: AuthUrlResponse,
        500: z.object({ error: z.unknown() }),
      },
    },
    handler: async (request, reply) => {
      const { tracingId, key } = getTracingHeader(request.headers);
      reply.header(key, tracingId);
      const authLogger = fastify.log.child({
        tracingId,
      });
      authLogger.debug("starting to generate auth url");

      try {
        const code_verifier = base64URLEncode(crypto.randomBytes(32));

        const codeChallenge = crypto
          .createHash("sha256")
          .update(code_verifier)
          .digest("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");

        const auth_url = encodeURI(
          `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.clientId}&scope=openid&include_granted_scopes=true&response_type=code&state=state_parameter_passthrough_value&code_challenge_method=S256&code_challenge=${codeChallenge}&redirect_uri=${request.body.redirect_uri}`,
        );

        return reply.code(200).send({ auth_url, code_verifier });
      } catch (error) {
        authLogger.error({ error }, "Error handling request");
        reply.code(500).send({ error: JSON.stringify(error) });
      }
    },
  });
};
