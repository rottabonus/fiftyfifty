import { z } from "zod";
import { timestampSchema } from "../../../lib/commonModels";

const Task = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: timestampSchema,
  dueDate: timestampSchema,
  done: z.boolean(),
  comment: z.string(),
  assigneeId: z.number(),
});

export const TasksResponse = z.object({
  tasks: z.array(Task),
});

export type Task = z.infer<typeof Task>;
