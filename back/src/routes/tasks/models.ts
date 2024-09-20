import { z } from "zod";
import { timestampSchema } from "../../lib/commonModels.js";

const DbTask = z.object({
  id: z.number(),
  createdAt: timestampSchema,
  dueDate: timestampSchema,
  comment: z.string(),
  done: z.boolean(),
});

export const CreateTask = z.object({
  name: z.string(),
  assigneeId: z.number(),
});

export const Task = z.intersection(DbTask, CreateTask);

export const TasksQueryResult = z.array(Task);

export const Tasks = z.object({
  tasks: TasksQueryResult,
});

export const TasksRequest = z.object({
  week: z.number(),
});
