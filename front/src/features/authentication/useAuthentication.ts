import React from "react";

import type { ENVIRONMENT } from "../../lib/config";
import { useLocation } from "./useLocation";
import { getAuthUrl } from "./api/getAuthUrl";
import { getAuthToken } from "./api/getAuthToken";

export const useAuthentication = (environment: ENVIRONMENT) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isUnauthorized, setIsUnauthorized] = React.useState(false);

  const login = async () => {
    await getAuthUrl(environment);
  };

  const removeQueryParams = () => {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, "", url);
  };

  const handleToken = async (code: string) => {
    const result = await getAuthToken(code, environment);
    setIsAuthenticated(result.isAuthenticated);
    setIsUnauthorized(result.status === 403);
    removeQueryParams();
  };

  React.useEffect(() => {
    // Parse authorizatiokn-code from redirect-uri
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      handleToken(code);
    }
  }, [location]);

  return { login, isAuthenticated, isUnauthorized };
};
