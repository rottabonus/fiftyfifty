import fp from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform } from "fastify-type-provider-zod";
import { config } from "../config.js";
import { newUid } from "../lib/utils.js";

export default fp((fastify, _opts, done) => {
  // Only run in development
  if (config.isDevelopment) {
    const swaggerLogger = fastify.log.child({
      tracingId: `swagger-${newUid()}`,
    });
    swaggerLogger.info("Creating swagger schema");

    fastify.register(fastifySwagger, {
      openapi: {
        info: {
          title: "Project budgeting app API",
          description: "Backend for project budgeting app",
          version: "1.0.0",
        },
        servers: [],
      },
      transform: jsonSchemaTransform,
    });

    fastify.register(fastifySwaggerUi, { routePrefix: "/docs" });
    swaggerLogger.info("Registering /docs route for swagger");
  }

  done();
});
