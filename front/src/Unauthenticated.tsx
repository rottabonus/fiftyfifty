import React from "react";
import { useAuthentication } from "./lib/useAuthentication";

import { App } from "./App";

export const Unauthenticated = () => {
  const { login, isAuthenticated } = useAuthentication();

  return (
    <div>
      {isAuthenticated ? (
        <App />
      ) : (
        <button onClick={login}>google login</button>
      )}
    </div>
  );
};
