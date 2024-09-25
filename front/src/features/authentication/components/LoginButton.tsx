import React from "react";
import { styled } from "@linaria/react";

type Props = {
  onClick: () => void;
  text: string;
};

export const LoginButton = ({ onClick, text }: Props) => {
  return <Button onClick={onClick}>{text}</Button>;
};

const Button = styled.button`
  padding: 8px;
  background: none;
  border: 2px solid black;
  border-radius: 8px;
  background-color: lightsalmon;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
