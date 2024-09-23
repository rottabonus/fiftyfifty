import React from "react";
import { useSocket } from "./SocketContext";
import type { UserType } from "./types";
import { User } from "../userInfo/getUser";

export const useSocketConnection = (user?: User) => {
  const { socket, connectSocket, disconnectSocket } = useSocket();
  const [connectedUsers, setConnectedUsers] = React.useState<UserType[]>([]);
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      connectSocket(user);
    }

    return () => {
      disconnectSocket();
    };
  }, [user]);

  React.useEffect(() => {
    if (socket) {
      const handleUserConnected = (socketUser: UserType) => {
        setConnectedUsers((prevUsers) => [...prevUsers, socketUser]);
        const isMe = socketUser.userID === user?.id;
        if (isMe) {
          setIsConnected(true);
        }
        console.log("User connected:", socketUser);
      };

      const handleUserDisconnected = (socketUser: UserType) => {
        setConnectedUsers((prevUsers) =>
          prevUsers.filter((u) => u.userID !== socketUser.userID),
        );
        const isMe = socketUser.userID === user?.id;
        if (isMe) {
          setIsConnected(false);
        }
        console.log("User disconnected:", socketUser);
      };

      // Listen for user connection events
      socket.on("user:connected", handleUserConnected);
      socket.on("user:disconnected", handleUserDisconnected);

      // Clean up listeners on unmount
      return () => {
        socket.off("user:connected", handleUserConnected);
        socket.off("user:disconnected", handleUserDisconnected);
      };
    }
  }, [socket]);

  return {
    connectedUsers,
    isConnected,
  };
};
