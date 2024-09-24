import { FastifyInstance } from "fastify";
import { TasksQueryResult } from "./models.js";

export const tasks = async (fastify: FastifyInstance) => {
  // connection-handler
  fastify.io.on("connection", async (socket) => {
    const socketLogger = fastify.log.child({
      tracingId: `user-${socket.handshake.auth.userID}-socket-task`,
    });

    // get default tasks
    const query = `
      SELECT * FROM tasks
      WHERE "dueDate" >= date_trunc('week', now()::timestamptz)
      AND "dueDate" < date_trunc('week', now()::timestamptz) + interval '1 week';
    `;
    const tasksResult = await fastify.pgQuery({
      query,
      model: TasksQueryResult,
      values: [],
      traceLogger: socketLogger,
    });
    if (!tasksResult.isOk) {
      socketLogger.error({ error: tasksResult.data }, "Error querying tasks");
    } else {
      socket.emit("tasks:get", tasksResult.data);
      socketLogger.info("Tasks emitted");
    }

    // update a task
    socket.on("task:update", async (task) => {
      socketLogger.info("Starting to put task-row");
      const query = `
        UPDATE tasks
        SET name = $1, "assigneeId" = $2, "createdAt" = $3, "dueDate" = $4, comment = $5, done = $6
        WHERE id = $7
        RETURNING id, name, "assigneeId", "createdAt", "dueDate", comment, done;
      `;

      const { name, assigneeId, createdAt, dueDate, comment, done, id } = task;
      const taskResult = await fastify.pgQuery({
        query,
        model: TasksQueryResult,
        values: [name, assigneeId, createdAt, dueDate, comment, done, id],
        traceLogger: socketLogger,
      });
      if (!taskResult.isOk) {
        socketLogger.error({ error: tasksResult.data }, "Error updating task");
      } else {
        socket.emit("task:updated", taskResult.data[0]);
        socketLogger.info("Task updated and emitted");
      }
    });

    // new task
    socket.on("task:new", async (task) => {
      socketLogger.info("Starting to post a task-row");
      const query = `
          INSERT INTO tasks (name, "assigneeId")
          VALUES ($1, $2)
          RETURNING id, name, "createdAt", "dueDate", "assigneeId", comment, done;
        `;

      const taskResult = await fastify.pgQuery({
        query,
        model: TasksQueryResult,
        values: [task.name, task.assigneeId],
        traceLogger: socketLogger,
      });
      if (!taskResult.isOk) {
        socketLogger.error({ error: tasksResult.data }, "Error creating task");
      } else {
        socket.emit("task:created", taskResult.data[0]);
        socketLogger.info("Task created and emitted");
      }
    });

    // delete a task
    socket.on("task:delete", async (id) => {
      socketLogger.info("Starting to delete a task-row");
      const query = `
          DELETE FROM tasks
          WHERE id = $1
          RETURNING *;
        `;

      const taskResult = await fastify.pgQuery({
        query,
        model: TasksQueryResult,
        values: [id],
        traceLogger: socketLogger,
      });
      if (!taskResult.isOk) {
        socketLogger.error({ error: tasksResult.data }, "Error deleting task");
      } else {
        socket.emit("task:deleted", taskResult.data[0].id);
        socketLogger.info("Task deleted and emitted");
      }
    });
  });
};

export default tasks;
