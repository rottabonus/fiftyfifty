import React from "react";
import { styled } from "@linaria/react";

export const Unauthorized = () => {
  return (
    <Container>
      <Text>
        You are <strong>unauthorized</strong> to access this application
      </Text>
    </Container>
  );
};

const Container = styled.div`
  min-width: 80%;
  padding: 16px;
  border: 1px solid black;
  background-color: #fdfd96;
  border-radius: 8px;
  box-shadow: 10px 5px 5px black;
`;

const Text = styled.p`
  font-size: xx-large;
`;
