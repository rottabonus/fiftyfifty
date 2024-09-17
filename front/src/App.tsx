import React from "react";
import { UserInfo } from "./features/userInfo";
import { TasksList } from "./features/tasksList";

export const App = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <UserInfo />
      <TasksList />
    </div>
  );
};
