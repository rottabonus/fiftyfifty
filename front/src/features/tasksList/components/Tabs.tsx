import React from "react";
import type { User } from "../../userInfo/getUser";

type Props = {
  users: Array<User>;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
};

export const Tabs = ({ users, selectedUser, setSelectedUser }: Props) => {
  return (
    <div style={{ display: "flex", gap: "8px" }}>
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
    </div>
  );
};
