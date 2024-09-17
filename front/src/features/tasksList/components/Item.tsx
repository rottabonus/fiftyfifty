import React from "react";
import type { Task } from "../getTasks";

import { useDebounce } from "../../../lib/useDebounce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putTask } from "../api/putTask";
import { useEnvironment } from "../../envContext/useEnvironment";

type Props = {
  task: Task;
};

export const Item = ({ task }: Props) => {
  const [localTaskName, setLocalTaskName] = React.useState(task.name);
  const environment = useEnvironment();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async (task: Task) => {
      putTask(task, environment);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTaskName(event.target.value);
    updateState(event.target.value);
  };

  const updateState = useDebounce((localValue: string) => {
    mutate({ ...task, name: localValue });
  }, 500);

  return (
    <li style={{ display: "flex", gap: "8px" }}>
      <input type="text" value={localTaskName} onChange={handleChange} />
      <input type="checkbox" checked={task.done} />
    </li>
  );
};
