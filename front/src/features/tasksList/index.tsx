import React from "react";
import type { User } from "../userInfo/getUser";
import type { Task } from "../socketContext/types";
import { useTaskSocket } from "../socketContext/useTaskSocket";
import { useQuery } from "@tanstack/react-query";
import { useEnvironment } from "../envContext/useEnvironment";
import { getUsers } from "./api/getUsers";
import { styled } from "@linaria/react";
import { Tabs } from "./components/Tabs";
import { Item } from "./components/Item";
import { NewTask } from "./components/NewTask";

export const TasksList = () => {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const { tasks, updateTask, deleteTask } = useTaskSocket();
  const environment = useEnvironment();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    refetchOnWindowFocus: false,
    queryFn: () => getUsers(environment),
  });

  const apply =
    (selected: User | null) =>
    ({ assigneeId }: Task) =>
      selected === null || selected.id === assigneeId;

  const filteredTasks = tasks.filter(apply(selectedUser));

  return (
    <Container>
      <Tabs
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />
      <List>
        {filteredTasks.map((task) => (
          <Item
            key={task.id}
            task={task}
            updateTask={updateTask}
            deleteTask={deleteTask}
            users={users}
          />
        ))}
      </List>
      <NewTask />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
