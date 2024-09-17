import React from "react";
import { useAuthentication } from "./features/useAuthentication";

import { App } from "./App";
import { useEnvironment } from "./features/envContext/useEnvironment";

export const Unauthenticated = () => {
  const environment = useEnvironment();
  const { login, isAuthenticated } = useAuthentication(environment);

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
