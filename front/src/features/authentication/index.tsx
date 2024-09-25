import React from "react";
import { useAuthentication } from "./useAuthentication";
import { useEnvironment } from "../envContext/useEnvironment";

type Props = {
  children: React.ReactNode;
};

export const Authentication = ({ children }: Props) => {
  const environment = useEnvironment();
  const { login, isAuthenticated, isUnauthorized } =
    useAuthentication(environment);

  return (
    <div>
      {isAuthenticated ? (
        <>{children}</>
      ) : isUnauthorized ? (
        <p>You are unauthorized to access this application</p>
      ) : (
        <button onClick={login}>google login</button>
      )}
    </div>
  );
};
