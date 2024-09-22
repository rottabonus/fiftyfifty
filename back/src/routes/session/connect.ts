import { FastifyInstance } from "fastify";
import { config } from "../../config.js";
import { SessionsQueryResult } from "./models.js";

export const startConnection = async (fastify: FastifyInstance) => {
  // connection-handler
  fastify.io.on("connection", async (socket) => {
    const socketLogger = fastify.log.child({
      tracingId: `user-${socket.handshake.auth.userId}-socket-connection`,
    });
    socketLogger.info("Connection established");
    socket.emit("user:connected", socket.handshake.auth);

    // insert or update session
    const query = `
        INSERT INTO sessions ("sessionId", "userId", connected)
        VALUES ($1, $2, true)
        ON CONFLICT ("userId") 
        DO UPDATE SET connected = true
        RETURNING id, "sessionId", "userId", connected;
      `;
    const values = [config.sessionId, socket.handshake.auth.userId];
    const sessionResult = await fastify.pgQuery({
      query,
      model: SessionsQueryResult,
      values,
      traceLogger: socketLogger,
    });
    if (!sessionResult.isOk) {
      socketLogger.error(
        { error: sessionResult.data },
        "Error updating session-info",
      );
    }

    // disconnect-handler
    socket.on("disconnect", async () => {
      socketLogger.info("Disconnected");
      socket.broadcast.emit("user:disconnected", socket.handshake.auth);
      // update session-info
      const query = `
          UPDATE sessions
          SET connected = false
          WHERE "userId" = $1
          RETURNING id, "sessionId", "userId", connected;
      `;
      const values = [socket.handshake.auth.userId];
      const disconnectSessionResult = await fastify.pgQuery({
        query,
        model: SessionsQueryResult,
        values,
        traceLogger: socketLogger,
      });
      if (!disconnectSessionResult.isOk) {
        socketLogger.error(
          { error: disconnectSessionResult.data },
          "Error updating session-info",
        );
      }
    });
  });
};
