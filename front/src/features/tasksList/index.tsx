import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../api/getTasks";

export const TasksList = () => {
  const { data } = useQuery({
    queryKey: ["tasks"],
    refetchOnWindowFocus: false,
    queryFn: () => getTasks(),
  });

  return (
    <div>
      <ol>{data?.tasks.map((task) => <li key={task.id}>{task.name}</li>)}</ol>
    </div>
  );
};
