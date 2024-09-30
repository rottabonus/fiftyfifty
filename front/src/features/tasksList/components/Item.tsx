import React from "react";
import type { Task } from "../../socketContext/types";
import type { User } from "../../userInfo/getUser";

import { useDebounce } from "../../../lib/useDebounce";

import { styled } from "@linaria/react";
import { RiDeleteBin7Line } from "react-icons/ri";
import { Input } from "./Input";
import { SelectInput } from "./SelectInput";
import { DeleteButton } from "./DeleteButton";

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
    <ListItem isDone={localTask.done}>
      <Input
        type="text"
        value={localTask.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <SelectInput
        value={String(localTask.assigneeId)}
        onChange={(e) =>
          handleChange(
            "assigneeId",
            e.target.value ? Number(e.target.value) : null,
          )
        }
      >
        <Option value={undefined} />
        {users.map((user) => (
          <Option key={`assigneeId_option_${user.id}`} value={user.id}>
            {user.name}
          </Option>
        ))}
      </SelectInput>
      <Checkbox
        type="checkbox"
        checked={localTask.done}
        onChange={(e) => handleChange("done", e.target.checked)}
      />
      <DeleteButton onClick={() => deleteTask(task.id)}>
        <RiDeleteBin7Line />
      </DeleteButton>
    </ListItem>
  );
};

const ListItem = styled.div<{ isDone: boolean }>`
  padding: 8px 16px;
  width: 500px;
  background-color: #f8d6b3;
  border: 1px solid black;
  display: flex;
  gap: 8px;
  box-shadow: 5px 3px 3px black;
  flex-wrap: wrap;
  position: relative;
  text-decoration: ${(props) => (props.isDone ? "line-through" : "none")};

  @media (max-width: 450px) {
    width: 90%;
  }
`;

const Option = styled.option`
  font-size: 24px;
`;

const Checkbox = styled.input`
  width: 32px;
  height: 32px;
  accent-color: #90ee90;
  cursor: pointer;
`;
