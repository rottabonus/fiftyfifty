import React from "react";
import type { Task } from "../../socketContext/types";

import { useDebounce } from "../../../lib/useDebounce";

type Props = {
  task: Task;
  updateTask: (task: Task) => void;
};

export const Item = ({ task, updateTask }: Props) => {
  const [localTask, setLocalTask] = React.useState(task);

  const handleChange = <T extends keyof Task>(key: T, value: Task[T]) => {
    setLocalTask({ ...task, [key]: value });
    updateState({ ...task, [key]: value });
  };

  const updateState = useDebounce((task: Task) => {
    console.log("updating", task);
    updateTask(task);
  }, 500);

  return (
    <li style={{ display: "flex", gap: "8px" }}>
      <input
        type="text"
        value={localTask.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <input
        type="checkbox"
        checked={localTask.done}
        onChange={(e) => handleChange("done", e.target.checked)}
      />
    </li>
  );
};
