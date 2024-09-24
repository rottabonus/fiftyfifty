import type { CreateTask, Task, User } from "./models.js";
import { Socket } from "socket.io-client";
import { z } from "zod";

export type Task = z.infer<typeof Task>;

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>;
export type UserType = z.infer<typeof User>;

export interface ServerToClientEvents {
  ["tasks:get"]: (tasks: Array<Task>) => void;
  ["task:created"]: (task: Task) => void;
  ["task:updated"]: (task: Task) => void;
  ["task:deleted"]: (id: number) => void;
  ["user:connected"]: (user: UserType) => void;
  ["user:disconnected"]: (user: UserType) => void;
}

export interface ClientToServerEvents {
  ["task:update"]: (data: Task) => void;
  ["task:new"]: (data: CreateTask) => void;
  ["task:delete"]: (id: number) => void;
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
