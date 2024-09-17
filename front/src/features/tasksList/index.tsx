import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "./getTasks";
import { useEnvironment } from "../envContext/useEnvironment";

export const TasksList = () => {
  const environment = useEnvironment();
  const { data } = useQuery({
    queryKey: ["tasks"],
    refetchOnWindowFocus: false,
    queryFn: () => getTasks(environment),
  });

  return (
    <div>
      <ol>{data?.tasks.map((task) => <li key={task.id}>{task.name}</li>)}</ol>
    </div>
  );
};
