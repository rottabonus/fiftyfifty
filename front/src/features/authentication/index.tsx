import React from "react";
import { useAuthentication } from "./useAuthentication";
import { useEnvironment } from "../envContext/useEnvironment";
import { styled } from "@linaria/react";
import { LoginForm } from "./components/LoginForm";
import { Unauthorized } from "./components/Unauthorized";

type Props = {
  children: React.ReactNode;
};

export const Authentication = ({ children }: Props) => {
  const environment = useEnvironment();
  const { login, isAuthenticated, isUnauthorized } =
    useAuthentication(environment);

  return (
    <Container>
      {isAuthenticated ? (
        <>{children}</>
      ) : isUnauthorized ? (
        <Unauthorized />
      ) : (
        <LoginForm onClick={login} text="Google login" />
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Authentication;
