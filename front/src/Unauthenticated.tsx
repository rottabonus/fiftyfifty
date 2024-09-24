import React from "react";
import { useAuthentication } from "./features/useAuthentication";

import { App } from "./App";
import { useEnvironment } from "./features/envContext/useEnvironment";

export const Unauthenticated = () => {
  const environment = useEnvironment();
  const { login, isAuthenticated, isUnauthorized } =
    useAuthentication(environment);

  return (
    <div>
      {isAuthenticated ? (
        <App />
      ) : isUnauthorized ? (
        <p>You are unauthorized to access this application</p>
      ) : (
        <button onClick={login}>google login</button>
      )}
    </div>
  );
};
