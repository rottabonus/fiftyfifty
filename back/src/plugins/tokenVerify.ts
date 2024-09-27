import fp from "fastify-plugin";
import { getTracingId, getToken } from "../lib/utils.js";
import { z } from "zod";
import { verifyToken } from "../lib/verifyToken.js";

// Only protect routes that are out of the google-system
const protectedResources = ["/users"];

export const TokenInfo = z.object({
  azp: z.string(),
  aud: z.string(),
  sub: z.string(),
  scope: z.string(),
  exp: z.string(),
  expires_in: z.string(),
  email: z.string(),
  email_verified: z.string(),
  access_type: z.union([z.literal("online"), z.literal("offline")]),
});

export default fp((fastify, _opts, done) => {
  fastify.addHook("onRequest", async (request, reply) => {
    const isProtectedResource = protectedResources.includes(request.url);
    if (!isProtectedResource) {
      return done();
    }

    const tracingId = getTracingId(request.headers);
    const traceLogger = fastify.log.child({ tracingId });
    traceLogger.debug("Starting to verify accessToken");

    try {
      const accessToken = getToken(request.headers);
      const isValid = await verifyToken(accessToken, traceLogger);
      if (!isValid) {
        traceLogger.error("Error verifying accessToken: not valid");
        reply.code(403).send({ error: "Unauthorized" });
      }
    } catch (error) {
      traceLogger.error(error, "Error verifying accessToken");
      reply.code(403).send({ error: "Unauthorized" });
    }
  });

  done();
});
