import { z } from "zod";

const timestampSchema = z.union([
  z.string().refine((str) => !isNaN(Date.parse(str)), {
    message: "Invalid date string",
  }), // validate if string is a valid date
  z.date(), // allow a Date object
]);

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
