import React from "react";
import { ENVIRONMENT } from "../../lib/config";

const EnvironmentContext = React.createContext<ENVIRONMENT>("none");

type Props = {
  environment: ENVIRONMENT;
  children: React.ReactNode;
};

export const EnvironmentProvider = ({ children, environment }: Props) => {
  return (
    <EnvironmentContext.Provider value={environment}>
      {children}
    </EnvironmentContext.Provider>
  );
};

export default EnvironmentContext;
