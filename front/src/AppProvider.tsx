import React from "react";
import { Unauthenticated } from "./Unauthenticated";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const AppProvider = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Unauthenticated />
    </QueryClientProvider>
  );
};
