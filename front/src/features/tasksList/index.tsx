import React from "react";
import type { User } from "../../api/getUser";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../../api/getTasks";

type Props = {
  user: User;
};

export const TasksList = ({ user }: Props) => {
  const { data } = useQuery({
    queryKey: ["tasks"],
    refetchOnWindowFocus: false,
    queryFn: () => getTasks(),
  });

  return (
    <div>
      <h2>Hello {user.name}</h2>
      <ol>{data?.tasks.map((task) => <li key={task.id}>{task.name}</li>)}</ol>
    </div>
  );
};
