import React from "react";
import { io } from "socket.io-client";
import { SocketClient } from "./types";
import { User } from "../userInfo/getUser";
import { ENVIRONMENT, config, getAccessToken } from "../../lib/config";

interface SocketContextType {
  socket: SocketClient | null;
  connectSocket: (user: User) => void;
  disconnectSocket: () => void;
}

const SocketContext = React.createContext<SocketContextType | undefined>(
  undefined,
);

export const useSocket = (): SocketContextType => {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider: React.FC<{
  children: React.ReactNode;
  environment: ENVIRONMENT;
}> = ({ children, environment }) => {
  const [socket, setSocket] = React.useState<SocketClient | null>(null);

  const connectSocket = (user: User) => {
    const newSocket = io(config[environment].baseUrl, {
      autoConnect: false,
      auth: { name: user.name, userID: user.id },
      extraHeaders: { authorization: String(getAccessToken()) },
    });

    newSocket.connect();
    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
  };

  React.useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const value = React.useMemo(
    () => ({ socket, connectSocket, disconnectSocket }),
    [socket],
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
