import React from "react";

export const useLocation = () => {
  const [location, setLocation] = React.useState(window.location.pathname);
  const listenToPopstate = () => {
    const winPath = window.location.pathname;
    setLocation(winPath);
  };

  React.useEffect(() => {
    window.addEventListener("popstate", listenToPopstate);
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
    };
  }, []);

  return location;
};
