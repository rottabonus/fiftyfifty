import { z } from "zod";
import { newUid } from "./utils";

export const TRACING_HEADER = "x-tracing-id";
export const config = {
  none: {
    baseUrl: "",
  },
  local: {
    baseUrl: "http://localhost:3000",
  },
  docker: {
    baseUrl: "http://backend:3000",
  },
  prod: {
    baseUrl: "",
  },
};

const typedObjectKeys = <T extends object>(object: T) =>
  Object.keys(object) as (keyof typeof object)[];
const [first, ...rest] = typedObjectKeys(config);

const Environment = z.enum([first, ...rest]);
export type ENVIRONMENT = z.infer<typeof Environment>;

export const toEnvironment = (data: null | string): ENVIRONMENT => {
  const parsed = Environment.safeParse(data);
  if (parsed.success) {
    return parsed.data;
  }

  return "none";
};

export const getTracingHeader = () => ({
  ["x-tracing-id"]: newUid(),
});

export const getAccessToken = () => {
  const accessToken = sessionStorage.getItem("access_token");
  return { Authorization: `Bearer ${accessToken}` };
};
