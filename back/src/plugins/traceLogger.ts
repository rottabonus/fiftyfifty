import fp from "fastify-plugin";
import { config } from "../config.js";
import { getTracingId, newUid } from "../lib/utils.js";

const excludedRoutes = ["/healthz"];

// Hooks for request/response
// We will set the tracingId for every request and also upstream if it is missing
export default fp((fastify, _opts, done) => {
  fastify.addHook("onRequest", (request, _reply, done) => {
    const url = request.url;
    if (excludedRoutes.includes(url)) {
      return done();
    }

    const tracingId = getTracingId(request.headers);
    request.headers[config.tracingHeader] = tracingId;
    const method = request.method;

    fastify.log.info({ tracingId, url, method }, "Incoming request");
    done();
  });

  fastify.addHook("onResponse", (request, reply, done) => {
    const url = request.url;
    if (excludedRoutes.includes(url)) {
      return done();
    }

    const tracingId = reply.getHeader(config.tracingHeader) ?? newUid();
    const responseTime = reply.elapsedTime;
    const responseStatus = reply.statusCode;

    // We wont log preflight requests because the tracing-id
    // cannot be used. It will cause unnecessary clutter
    // CORS issues will be very apparent without logs anyway and the ffront is sever in same origin as server
    if (request.method.toUpperCase() !== "OPTIONS") {
      fastify.log.info(
        {
          tracingId,
          responseTime,
          responseStatus,
        },
        "Request completed"
      );
    }

    done();
  });

  done();
});
