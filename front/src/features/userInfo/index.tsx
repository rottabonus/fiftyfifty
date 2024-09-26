import React from "react";
import { getUser } from "./getUser";
import { useQuery } from "@tanstack/react-query";
import { useEnvironment } from "../envContext/useEnvironment";
import { useSocketConnection } from "../socketContext/useSocketConnection";
import { styled } from "@linaria/react";

export const UserInfo = () => {
  const environment = useEnvironment();
  const { data } = useQuery({
    queryKey: ["user"],
    refetchOnWindowFocus: false,
    queryFn: () => getUser(environment),
  });
  const { isConnected } = useSocketConnection(data?.user);

  return (
    <Container>
      <TextContainer>
        <h2>Hello, </h2>
        <UserName isConnected={isConnected}>{data?.user.name}!</UserName>
      </TextContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TextContainer = styled.div`
  display: flex;
  gap: 8px;
`;

const UserName = styled.h2<{ isConnected: boolean }>`
  color: ${(props) => (props.isConnected ? "#c4a1ff" : "#ff6b6b")};
`;
