import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "./api/getTasks";
import { useEnvironment } from "../envContext/useEnvironment";
import { Item } from "./components/Item";

export const TasksList = () => {
  const environment = useEnvironment();
  const { data } = useQuery({
    queryKey: ["tasks"],
    refetchOnWindowFocus: false,
    queryFn: () => getTasks(environment),
  });

  return (
    <div>
      <ol>{data?.tasks.map((task) => <Item key={task.id} task={task} />)}</ol>
    </div>
  );
};
