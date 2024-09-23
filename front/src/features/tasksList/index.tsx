import React from "react";
import { Item } from "./components/Item";
import { useTaskSocket } from "../socketContext/useTaskSocket";
import { NewTask } from "./components/NewTask";

export const TasksList = () => {
  const { tasks, updateTask } = useTaskSocket();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <ol>
        {tasks.map((task) => (
          <Item key={task.id} task={task} updateTask={updateTask} />
        ))}
      </ol>
      <NewTask />
    </div>
  );
};
