import React from "react";
import { App } from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const AppProvider = () => {
  return (
    <GoogleOAuthProvider clientId="599777829877-ue9a2i1heivtnoivv9fkh12bnjmegjkj.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  );
};
