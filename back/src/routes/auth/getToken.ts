import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { TokenRequest, TokenResponse } from "./models.js";
import { getTracingHeader } from "../../lib/utils.js";
import { config } from "../../config.js";
import { verifyToken } from "../../lib/verifyToken.js";
import { getUserInfo } from "../../lib/getUserInfo.js";

export const getAuthToken = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: "POST",
    url: "/auth/token/new",
    schema: {
      body: TokenRequest,
      response: {
        200: TokenResponse,
        400: z.object({ error: z.string() }),
        403: z.object({ error: z.literal("Unauthorized") }),
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

        //get token
        const tokens = await fetch("https://oauth2.googleapis.com/token", {
          method: "post",
          body: JSON.stringify(tokenRequest),
        });
        const tokensJson = await tokens.json();
        const tokenParsed = TokenResponse.safeParse(tokensJson);
        if (!tokenParsed.success) {
          authLogger.error({ parsed: tokenParsed }, "Error parsing response");
          return reply.code(500).send({ error: "Error fetching accessToken" });
        }

        // verify token
        const isAllowed = await verifyToken(
          tokenParsed.data.access_token,
          authLogger,
        );
        if (!isAllowed) {
          return reply.code(403).send({ error: "Unauthorized" });
        }

        // get user info
        const userParsed = await getUserInfo(tokenParsed.data.access_token);
        if (!userParsed.success) {
          return reply.code(500).send({
            error: `Could not parse userinfo: ${JSON.stringify(userParsed.error)} `,
          });
        }

        // insert user or update lastLogin
        const query = `
            INSERT INTO users (name, email, "lastLogin")
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            ON CONFLICT (email) 
            DO UPDATE SET "lastLogin" = EXCLUDED."lastLogin"
            RETURNING id, name, email, "createdAt", "lastLogin";
          `;
        const values = [userParsed.data.name, userParsed.data.email];
        const userResult = await fastify.pgQuery({
          query,
          model: z.unknown(),
          values,
          traceLogger: authLogger,
        });
        if (!userResult.isOk) {
          reply.code(500).send({
            error: `Error updating login information: ${JSON.stringify(userResult.data)}`,
          });
        }

        // success
        return reply.code(200).send(tokensJson);
      } catch (error) {
        // internal server error
        authLogger.error({ error }, "Error handling request");
        reply.code(500).send({ error: JSON.stringify(error) });
      }
    },
  });
};
