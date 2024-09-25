import React from "react";
import { useAuthentication } from "./useAuthentication";
import { useEnvironment } from "../envContext/useEnvironment";
import { LoginButton } from "./components/LoginButton";

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
        <LoginButton onClick={login} text="Google login" />
      )}
    </div>
  );
};

export default Authentication;
