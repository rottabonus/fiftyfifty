import React from "react";
import type { ENVIRONMENT } from "./lib/config";
import { EnvironmentProvider } from "./features/envContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketProvider } from "./features/socketContext";
import { Authentication } from "./features/authentication";
import { App } from "./App";

type Props = {
  environment: ENVIRONMENT;
};
export const AppProvider = ({ environment }: Props) => {
  const queryClient = new QueryClient();

  return (
    <React.StrictMode>
      <EnvironmentProvider environment={environment}>
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <Authentication>
              <App />
            </Authentication>
          </SocketProvider>
        </QueryClientProvider>
      </EnvironmentProvider>
    </React.StrictMode>
  );
};
