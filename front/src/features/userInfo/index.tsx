import React from "react";
import { getUser } from "./getUser";
import { useQuery } from "@tanstack/react-query";
import { useEnvironment } from "../envContext/useEnvironment";
import { useSocketConnection } from "../socketContext/useSocketConnection";

export const UserInfo = () => {
  const environment = useEnvironment();
  const { data } = useQuery({
    queryKey: ["user"],
    refetchOnWindowFocus: false,
    queryFn: () => getUser(environment),
  });
  const { isConnected, connectedUsers } = useSocketConnection(data?.user);

  console.log("isConnected", isConnected);
  console.log("connectedUsers", connectedUsers);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <h2>Hello, {data?.user.name}!</h2>
    </div>
  );
};
