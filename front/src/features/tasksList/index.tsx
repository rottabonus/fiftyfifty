import React from "react";
import { useTaskSocket } from "../socketContext/useTaskSocket";
import { useQuery } from "@tanstack/react-query";
import { useEnvironment } from "../envContext/useEnvironment";
import { getUsers } from "./api/getUsers";
import { Item } from "./components/Item";
import { NewTask } from "./components/NewTask";

export const TasksList = () => {
  const { tasks, updateTask } = useTaskSocket();
  const environment = useEnvironment();
  const { data } = useQuery({
    queryKey: ["users"],
    refetchOnWindowFocus: false,
    queryFn: () => getUsers(environment),
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <ol>
        {tasks.map((task) => (
          <Item
            key={task.id}
            task={task}
            updateTask={updateTask}
            users={data?.users ?? []}
          />
        ))}
      </ol>
      <NewTask />
    </div>
  );
};
