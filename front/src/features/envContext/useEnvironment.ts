import React from "react";
import EnvironmentContext from "./index";

export const useEnvironment = () => {
  const context = React.useContext(EnvironmentContext);
  if (!context) {
    throw new Error(
      "useEnvironment must be used within an EnvironmentProvider",
    );
  }
  return context;
};
