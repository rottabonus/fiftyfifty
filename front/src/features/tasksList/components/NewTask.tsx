import React from "react";
import { useTaskSocket } from "../../socketContext/useTaskSocket";
import { CreateTask } from "../../socketContext/models";
import { Input } from "./Input";
import { styled } from "@linaria/react";

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
    <Container>
      <Input
        type="text"
        id="new-task-input"
        name="name"
        value={newTask.name}
        onChange={(e) => handleUpdate("name", e.target.value)}
      />
      <Input
        type="text"
        id="new-task-assignee"
        name="assigneeId"
        style={{ display: "none" }}
        value={Number(newTask.assigneeId)}
        onChange={(e) => handleUpdate("assigneeId", Number(e.target.value))}
      />
      <NewButton onClick={() => createTask(newTask)}>new</NewButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

const NewButton = styled.button`
  padding: 8px;
  font-size: large;
  background: none;
  border: 2px solid black;
  border-radius: 8px;
  box-shadow: 5px 3px 3px black;
  background-color: #e3dff2;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
  color: black;
`;
