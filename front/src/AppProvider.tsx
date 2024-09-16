import React from "react";
import { App } from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const AppProvider = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};
