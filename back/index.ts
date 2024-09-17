import Fastify from "fastify";
import { config } from "./src/config.js";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import traceLogger from "./src/plugins/traceLogger.js";
import swagger from "./src/plugins/swagger.js";
import pgClient from "./src/plugins/pgClient.js";
import fastifyStatic from "@fastify/static";
import { toWwwHtmlDir } from "./src/lib/utils.js";
import { getHealth } from "./src/routes/health/get.js";
import { getUser } from "./src/routes/user/get.js";
import { getTasks } from "./src/routes/tasks/get.js";
import { postTask } from "./src/routes/tasks/post.js";
import { getAuthUrl } from "./src/routes/auth/getAuthUrl.js";
import { getAuthToken } from "./src/routes/auth/getToken.js";

const fastify = Fastify({
  logger: {
    level: config.logLevel,
  },
  disableRequestLogging: true, // we use our own tracelogger!
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Plugins
await fastify.register(cors, {
  origin: ["http://localhost:3001"],
});
fastify.register(traceLogger);
fastify.register(swagger);
fastify.register(pgClient);

// Routes
fastify.register(fastifyStatic, {
  root: toWwwHtmlDir(import.meta.url),
});
fastify.register(getUser);
fastify.register(getHealth);
fastify.register(getTasks);
fastify.register(postTask);
fastify.register(getAuthUrl);
fastify.register(getAuthToken);

const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
