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
      <button
        onClick={() => setSelectedUser(null)}
        style={{ color: !selectedUser ? "green" : "black" }}
      >
        all
      </button>
      {users.map((user) => (
        <button
          key={`tab_${user.id}`}
          onClick={() => setSelectedUser(user)}
          style={{ color: selectedUser?.id === user.id ? "green" : "black" }}
        >
          {user.name}
        </button>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 8px;
`;
