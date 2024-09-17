import React from "react";

import type { ENVIRONMENT } from "../../lib/config";
import { useLocation } from "./useLocation";
import { getAuthUrl } from "./getAuthUrl";
import { getAuthToken } from "./getAuthToken";

export const useAuthentication = (environment: ENVIRONMENT) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  const login = async () => {
    await getAuthUrl(environment);
  };

  const handleToken = async (code: string) => {
    const result = await getAuthToken(code, environment);
    setIsAuthenticated(result.isAuthenticated);
  };

  React.useEffect(() => {
    // Parse authorizatiokn-code from redirect-uri
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      handleToken(code);
    }
  }, [location]);

  return { login, isAuthenticated };
};
