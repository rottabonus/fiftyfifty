import { styled } from "@linaria/react";

export const DeleteButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: large;
  background: none;
  border: 2px solid black;
  box-shadow: 0 1px 1px black;
  background-color: #ff6b6b;
  &:hover {
    opacity: 0.8;
    cursor: pointer;
  }
  color: #e3dff2;
`;
