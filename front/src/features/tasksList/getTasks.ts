import { z } from "zod";
import type { ENVIRONMENT } from "../../lib/config";
import { getTracingHeader, getAccessToken, config } from "../../lib/config";

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
  assignee: z.string(),
});

const TasksResponse = z.object({
  tasks: z.array(Task),
});

export type Task = z.infer<typeof Task>;

export const getTasks = async (environment: ENVIRONMENT) => {
  const tasksResponse = await fetch(`${config[environment].baseUrl}/tasks`, {
    method: "get",
    headers: {
      ...getTracingHeader(),
      ...getAccessToken(),
    },
  });
  const tasksJson = await tasksResponse.json();

  const parsed = TasksResponse.safeParse(tasksJson);
  if (parsed.success) {
    return parsed.data;
  }

  console.error(parsed.error);
  return null;
};
