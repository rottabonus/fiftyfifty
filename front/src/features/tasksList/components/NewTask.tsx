import React from "react";
import { useTaskSocket } from "../../socketContext/useTaskSocket";
import { CreateTask } from "../../socketContext/models";

type Props = {};

export const NewTask = ({}: Props) => {
  const { createTask } = useTaskSocket();
  const [newTask, setNewTask] = React.useState<CreateTask>({
    name: "",
    assigneeId: null,
  });

  const handleUpdate = <T extends keyof CreateTask>(
    key: T,
    value: CreateTask[T],
  ) => {
    setNewTask({ ...newTask, [key]: value });
  };

  return (
    <div>
      <input
        type="text"
        id="new-task-input"
        name="name"
        value={newTask.name}
        onChange={(e) => handleUpdate("name", e.target.value)}
      />
      <input
        type="text"
        id="new-task-assignee"
        name="assigneeId"
        style={{ display: "none" }}
        value={Number(newTask.assigneeId)}
        onChange={(e) => handleUpdate("assigneeId", Number(e.target.value))}
      />
      <button onClick={() => createTask(newTask)}>new</button>
    </div>
  );
};
