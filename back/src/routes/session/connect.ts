import { FastifyInstance } from "fastify";

export const startConnection = async (fastify: FastifyInstance) => {
  // const query = "SELECT * FROM sessions WHERE userId = $1";
  //
  // const sessionsResult = await fastify.pgQuery({
  //   query,
  //   model: SessionsQueryResult,
  //   values: [userId],
  //   traceLogger: connectionLogger,
  // });

  // on connection
  // TODO: store row connected:true for session
  fastify.io.on("connection", (socket) => {
    console.log("connected", socket.handshake.auth);
    socket.emit("user:connected", socket.handshake.auth);

    // disconnect handler
    // TODO:disconnect update connected:false for session
    socket.on("disconnect", async () => {
      console.log("disconnected", socket.handshake.auth);
      socket.broadcast.emit("user:disconnected", socket.handshake.auth);
    });
  });
};
