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
import tokenVerify from "./src/plugins/tokenVerify.js";
import io from "./src/plugins/socketIo.js";
import session from "./src/socketService/session/index.js";
import tasks from "./src/socketService/tasks/index.js";
import { toWwwHtmlDir } from "./src/lib/utils.js";
import { getHealth } from "./src/routes/health/get.js";
import { getAuthUrl } from "./src/routes/auth/getAuthUrl.js";
import { getAuthToken } from "./src/routes/auth/getToken.js";
import { getUsers } from "./src/routes/users/get.js";
import { getUser } from "./src/routes/user/get.js";

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
  origin: [
    "http://localhost:3001",
    "https://fifty-app.com",
    "https://www.fifty-app.com",
  ],
});
fastify.register(traceLogger);
fastify.register(swagger);
fastify.register(pgClient);
fastify.register(tokenVerify);
fastify.register(io);

// Routes
fastify.register(fastifyStatic, {
  root: toWwwHtmlDir(import.meta.url),
});
fastify.register(getUser);
fastify.register(getUsers);
fastify.register(getHealth);
fastify.register(getAuthUrl);
fastify.register(getAuthToken);

// Socket-service
fastify.register(session);
fastify.register(tasks);

const start = async () => {
  try {
    await fastify.listen({ port: config.port, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
