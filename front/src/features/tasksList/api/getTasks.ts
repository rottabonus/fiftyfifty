import type { ENVIRONMENT } from "../../../lib/config";
import { getTracingHeader, getAccessToken, config } from "../../../lib/config";
import { TasksResponse } from "./models";

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
