import React from "react";
import { getUser } from "./getUser";
import { useQuery } from "@tanstack/react-query";
import { useEnvironment } from "../envContext/useEnvironment";

export const UserInfo = () => {
  const environment = useEnvironment();
  const { data } = useQuery({
    queryKey: ["user"],
    refetchOnWindowFocus: false,
    queryFn: () => getUser(environment),
  });

  return (
    <div>
      <h2>Hello, {data?.name}!</h2>
    </div>
  );
};
