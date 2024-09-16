import dotenv from "dotenv";

dotenv.config();

export const config = {
  isDevelopment:
    process.env.ENVIRONMENT === "local" || process.env.ENVIRONMENT === "docker",
  logLevel: process.env.LOGLEVEL ?? "info",
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  tracingHeader: "x-tracing-id",
  clientId: String(process.env.CLIENT_ID),
  clientSecret: String(process.env.CLIENT_SECRET),
  redirectUri: String(process.env.REDIRECT_URI),
  pg: {
    user: String(process.env.PGUSER),
    password: String(process.env.PGPASSWORD),
    port: Number(process.env.PGPORT),
    database: String(process.env.PGDATABASE),
    host: String(process.env.PGHOST),
  },
};
