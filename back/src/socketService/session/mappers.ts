import type { SocketUserType } from "../types.js";
import { SocketUser } from "../types.js";

export const toUser = (data: Record<string, unknown>): SocketUserType => {
  const parsed = SocketUser.safeParse(data);
  if (parsed.success) {
    return parsed.data;
  }

  return { name: "", userID: 0 };
};
