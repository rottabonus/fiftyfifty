import { FastifyInstance } from "fastify";
import { config } from "../../config.js";
import { SessionsQueryResult } from "./models.js";
import { toUser } from "./mappers.js";

export const session = async (fastify: FastifyInstance) => {
  // connection-handler
  fastify.io.on("connection", async (socket) => {
    const socketLogger = fastify.log.child({
      tracingId: `user-${socket.handshake.auth.userId}-socket-session`,
    });
    socketLogger.info("Connection established");
    const user = toUser(socket.handshake.auth);
    fastify.io.emit("user:connected", user);

    // insert or update session
    const query = `
        INSERT INTO sessions ("sessionId", "userId", connected)
        VALUES ($1, $2, true)
        ON CONFLICT ("userId") 
        DO UPDATE SET connected = true
        RETURNING id, "sessionId", "userId", connected;
      `;
    const sessionResult = await fastify.pgQuery({
      query,
      model: SessionsQueryResult,
      values: [config.sessionId, user.userID],
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
      socket.broadcast.emit("user:disconnected", user);
      // update session-info
      const query = `
          UPDATE sessions
          SET connected = false
          WHERE "userId" = $1
          RETURNING id, "sessionId", "userId", connected;
      `;
      const disconnectSessionResult = await fastify.pgQuery({
        query,
        model: SessionsQueryResult,
        values: [user.userID],
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

export default session;
