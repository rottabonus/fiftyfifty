import React from "react";
import { getUser } from "./getUser";
import { getAccessToken } from "../../lib/config";
import { useQuery } from "@tanstack/react-query";
import { useEnvironment } from "../envContext/useEnvironment";
import { Socket, io } from "socket.io-client";

interface ServerToClientEvents {
  ["user:connected"]: (users: string) => void;
  ["user:disconnected"]: (users: string) => void;
}

interface ClientToServerEvents {}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  "http://localhost:3000",
  {
    autoConnect: false,
    extraHeaders: { authorization: String(getAccessToken()) },
  },
);

// TODO:
// - User id is added to session
// - Initial tasks can be fetched with GET
// - Use socket connection to make changes to tasks
// - When changes are made to tasks, new tasks are broadcasted to the pool

export const UserInfo = () => {
  const [isConnected, setIsConnected] = React.useState(false);

  const handleConnect = () => {
    // add userID to auth!
    socket.auth = { name: data?.user.name, userId: data?.user.id };
    socket.connect();
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    socket.disconnect();
  };

  React.useEffect(() => {
    socket.on("user:connected", (user) => {
      console.log("user connected", user);
      setIsConnected(true);
    });

    socket.on("user:disconnected", (user) => {
      console.log("user disconnected", user);
      setIsConnected(false);
    });
  }, []);
  const environment = useEnvironment();
  const { data } = useQuery({
    queryKey: ["user"],
    refetchOnWindowFocus: false,
    queryFn: () => getUser(environment),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <h2>Hello, {data?.user.name}!</h2>
      {isConnected ? (
        <button onClick={handleDisconnect}>disconnect</button>
      ) : (
        <button onClick={handleConnect}>connect</button>
      )}
    </div>
  );
};
