import React from "react";
import type { ENVIRONMENT } from "./lib/config";
import { EnvironmentProvider } from "./features/envContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Unauthenticated } from "./Unauthenticated";
import { SocketProvider } from "./features/socketContext";

type Props = {
  environment: ENVIRONMENT;
};
export const AppProvider = ({ environment }: Props) => {
  const queryClient = new QueryClient();

  return (
    <EnvironmentProvider environment={environment}>
      <QueryClientProvider client={queryClient}>
        <SocketProvider>
          <Unauthenticated />
        </SocketProvider>
      </QueryClientProvider>
    </EnvironmentProvider>
  );
};
