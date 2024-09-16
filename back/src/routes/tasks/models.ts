import { z } from "zod";

const timestampSchema = z.union([
  z.string().refine((str) => !isNaN(Date.parse(str)), {
    message: "Invalid date string",
  }), // validate if string is a valid date
  z.date(), // allow a Date object
]);

const DbTask = z.object({
  id: z.number(),
  createdAt: timestampSchema,
  dueDate: timestampSchema,
  done: z.boolean(),
});

export const CreateTask = z.object({
  name: z.string(),
  assignee: z.string(),
});

export const Task = z.union([DbTask, CreateTask]);

export const TasksQueryResult = z.array(Task);

export const Tasks = z.object({
  tasks: TasksQueryResult,
});

export const TasksRequest = z.object({
  week: z.number(),
});
