import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import type { User } from "./api/getUser";
import { getUser } from "./api/getUser";
import { TasksList } from "./features/tasksList";

export const App = () => {
  const [user, setUser] = React.useState<null | User>(null);

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      const user = await getUser(codeResponse.code);
      setUser(user);
    },
    onError: (error) => {
      console.error("error", error);
    },
    flow: "auth-code",
  });

  return (
    <div>
      {user ? (
        <TasksList user={user} />
      ) : (
        <button onClick={login}>google login</button>
      )}
    </div>
  );
};
