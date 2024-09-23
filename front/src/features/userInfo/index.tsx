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
  const { isConnected } = useSocketConnection(data?.user);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", gap: "8px" }}>
        <h2>Hello, </h2>
        <h2 style={{ color: isConnected ? "green" : "red" }}>
          {data?.user.name}!
        </h2>
      </div>
    </div>
  );
};
