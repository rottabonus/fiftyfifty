import React from "react";
import type { User } from "../../userInfo/getUser";
import { styled } from "@linaria/react";

type Props = {
  users: Array<User>;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
};

export const Tabs = ({ users, selectedUser, setSelectedUser }: Props) => {
  return (
    <Container>
      <Tab onClick={() => setSelectedUser(null)} isSelected={!selectedUser}>
        all
      </Tab>
      {users.map((user) => (
        <Tab
          key={`tab_${user.id}`}
          onClick={() => setSelectedUser(user)}
          isSelected={selectedUser?.id === user.id}
        >
          {user.name}
        </Tab>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 8px;
`;

const Tab = styled.button<{ isSelected: boolean }>`
  padding: 4px;
  font-size: large;
  background: none;
  border: 2px solid black;
  box-shadow: 5px 3px 3px black;
  background-color: ${(props) => (props.isSelected ? "#c4a1ff" : "#e3dff2")};
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
