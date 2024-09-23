import React from "react";
import { Item } from "./components/Item";
import { useTaskSocket } from "../socketContext/useTaskSocket";

export const TasksList = () => {
  const { tasks, updateTask } = useTaskSocket();

  return (
    <div>
      <ol>
        {tasks.map((task) => (
          <Item key={task.id} task={task} updateTask={updateTask} />
        ))}
      </ol>
    </div>
  );
};
