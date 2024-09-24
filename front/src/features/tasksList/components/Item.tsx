import React from "react";
import type { Task } from "../../socketContext/types";
import type { User } from "../../userInfo/getUser";

import { useDebounce } from "../../../lib/useDebounce";

import { RiDeleteBin7Line } from "react-icons/ri";

type Props = {
  task: Task;
  users: Array<User>;
  updateTask: (task: Task) => void;
  deleteTask: (id: number) => void;
};

export const Item = ({ task, users, updateTask, deleteTask }: Props) => {
  const [localTask, setLocalTask] = React.useState(task);

  const handleChange = <T extends keyof Task>(key: T, value: Task[T]) => {
    setLocalTask({ ...task, [key]: value });
    updateState({ ...task, [key]: value });
  };

  const updateState = useDebounce((task: Task) => {
    updateTask(task);
  }, 500);

  return (
    <li style={{ display: "flex", gap: "8px" }}>
      <input
        type="text"
        value={localTask.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <select
        value={String(localTask.assigneeId)}
        onChange={(e) =>
          handleChange(
            "assigneeId",
            e.target.value ? Number(e.target.value) : null,
          )
        }
      >
        <option value={undefined} />
        {users.map((user) => (
          <option key={`assigneeId_option_${user.id}`} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <input
        type="checkbox"
        checked={localTask.done}
        onChange={(e) => handleChange("done", e.target.checked)}
      />
      <button style={{}} onClick={() => deleteTask(task.id)}>
        <RiDeleteBin7Line />
      </button>
    </li>
  );
};
