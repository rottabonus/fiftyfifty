import { styled } from "@linaria/react";

export const Input = styled.input`
  font-size: 24px;
  border: 2px solid black;
  box-shadow: 3px 1px 1px black;
  &:focus {
    outline: 1px solid #e3a018;
    border: 1px solid #e3a018;
    box-shadow: 3px 1px 1px #e3a018;
    caret-color: #e3a018;
  }
`;
