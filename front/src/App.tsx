import React from "react";
import { UserInfo } from "./features/userInfo";
import { TasksList } from "./features/tasksList";
import { styled } from "@linaria/react";

export const App = () => {
  return (
    <Container>
      <UserInfo />
      <TasksList />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px;
`;
