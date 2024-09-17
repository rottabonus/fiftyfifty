import type { ENVIRONMENT } from "../../../lib/config";
import type { Task } from "./models";
import { getTracingHeader, getAccessToken, config } from "../../../lib/config";
import { TasksResponse } from "./models";

export const putTask = async (task: Task, environment: ENVIRONMENT) => {
  const tasksResponse = await fetch(
    `${config[environment].baseUrl}/task/${task.id}`,
    {
      method: "put",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
        ...getTracingHeader(),
        ...getAccessToken(),
      },
    },
  );
  const tasksJson = await tasksResponse.json();

  const parsed = TasksResponse.safeParse(tasksJson);
  if (parsed.success) {
    return parsed.data;
  }

  console.error(parsed.error);
  return null;
};
