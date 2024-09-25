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
  font-size: xx-large;
  background: none;
  border: 2px solid black;
  border-radius: 8px;
  box-shadow: 5px 3px 3px black;
  background-color: lightsalmon;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
`;
