import React from "react";
import { getUser } from "../../api/getUser";
import { useQuery } from "@tanstack/react-query";

export const UserInfo = () => {
  const { data } = useQuery({
    queryKey: ["user"],
    refetchOnWindowFocus: false,
    queryFn: () => getUser(),
  });

  return (
    <div>
      <h2>Hello, {data?.name}!</h2>
    </div>
  );
};
