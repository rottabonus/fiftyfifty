import { z } from "zod";
import { timestampSchema } from "../../lib/commonModels";

export const CreateTask = z.object({
  name: z.string(),
  assigneeId: z.nullable(z.number()),
});
export type CreateTask = z.infer<typeof CreateTask>;

export const RestTask = z.object({
  id: z.number(),
  createdAt: timestampSchema,
  dueDate: timestampSchema,
  done: z.boolean(),
  comment: z.nullable(z.string()),
});

export const Task = z.intersection(CreateTask, RestTask);

export const TasksResponse = z.object({
  tasks: z.array(Task),
});

export const User = z.object({
  name: z.string(),
  userID: z.number(),
});
