import React from "react";
import type { Task } from "../api/models";

import { useDebounce } from "../../../lib/useDebounce";

type Props = {
  task: Task;
  updateTask: (task: Task) => void;
};

export const Item = ({ task, updateTask }: Props) => {
  const [localTaskName, setLocalTaskName] = React.useState(task.name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTaskName(event.target.value);
    updateState(event.target.value);
  };

  const updateState = useDebounce((localValue: string) => {
    updateTask({ ...task, name: localValue });
  }, 500);

  return (
    <li style={{ display: "flex", gap: "8px" }}>
      <input type="text" value={localTaskName} onChange={handleChange} />
      <input type="checkbox" checked={task.done} />
    </li>
  );
};
