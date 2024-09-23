import type { Task } from "./tasks/models.js";
import { Server } from "socket.io";
import { z } from "zod";

export type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;
export const SocketUser = z.object({
  name: z.string(),
  userID: z.number(),
});
export type SocketUserType = z.infer<typeof SocketUser>;

export interface ServerToClientEvents {
  ["tasks:get"]: (tasks: Array<Task>) => void;
  ["task:updated"]: (task: Task) => void;
  ["user:connected"]: (user: SocketUserType) => void;
  ["user:disconnected"]: (user: SocketUserType) => void;
}

export interface ClientToServerEvents {
  ["task:update"]: (data: Task) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  userID: number;
  connected: boolean;
  sessionID: string;
}
