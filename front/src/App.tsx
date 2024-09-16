import React from "react";
import { useLocation } from "./lib/useLocation";

import { getAuthUrl } from "./api/getAuthUrl";
import { getAuthToken } from "./api/getAuthToken";

export const App = () => {
  const location = useLocation();

  const handleCode = async () => {
    await getAuthUrl();
  };

  const handleToken = async (code: string) => {
    await getAuthToken(code);
  };

  React.useEffect(() => {
    // Parse id from referrer or url
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      handleToken(code);
    }
  }, [location]);

  return (
    <div>
      <button onClick={handleCode}>google login</button>
    </div>
  );
};
