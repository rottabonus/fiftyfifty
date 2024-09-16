import "./index.css";
import React from "react";
import ReactDOMClient from "react-dom/client";
import { AppProvider } from "./src/AppProvider";
import { toEnvironment } from "./src/lib/config";

const root = document.getElementById("root");

if (root) {
  const environment = toEnvironment(root.getAttribute("data-environment"));
  const props = { environment };

  ReactDOMClient.createRoot(root).render(
    React.createElement(AppProvider, props),
  );
}
