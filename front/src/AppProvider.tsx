import React from "react";
import { App } from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const AppProvider = () => {
  const queryClient = new QueryClient();

  return (
    <GoogleOAuthProvider clientId="599777829877-ue9a2i1heivtnoivv9fkh12bnjmegjkj.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};
