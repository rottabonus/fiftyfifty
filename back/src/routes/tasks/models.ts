import { z } from "zod";

const timestampSchema = z.union([
  z
    .string()
    .refine((str) => !isNaN(Date.parse(str)), {
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
  assignee: z.string(),
});
export const TasksQueryResult = z.array(Task);

export const Tasks = z.object({
  tasks: TasksQueryResult,
});

export const TasksRequest = z.object({
  week: z.number(),
});
