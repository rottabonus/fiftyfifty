import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

export const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log("codeResponse", codeResponse);
      const user = await fetch("http://localhost:3000/user", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeResponse.code }),
      });
      const userJson = await user.json();
      setIsLoggedIn(true);
      console.log("userJson", userJson);
    },
    onError: (error) => {
      console.log("error", error);
    },
    flow: "auth-code",
  });

  return (
    <div>
      {isLoggedIn && (
        <div>
          <h2>hello</h2>
        </div>
      )}
      <button onClick={login}>google login</button>
    </div>
  );
};
