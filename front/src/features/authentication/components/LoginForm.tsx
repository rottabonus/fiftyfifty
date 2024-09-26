import React from "react";
import { styled } from "@linaria/react";
import { LoginButton } from "./LoginButton";

type Props = {
  onClick: () => void;
  text: string;
};

export const LoginForm = (props: Props) => {
  return (
    <Container>
      <LoginButton {...props} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 200px;
  padding: 32px 16px;
  border: 1px solid black;
  background-color: #daf5f0;
  border-radius: 8px;
  box-shadow: 10px 5px 5px black;
  gap: 8px;
`;
