import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/index.css"; // Import global styles
import { AuthProvider } from "react-oidc-context";
import { cognitoAuthConfig } from "./cognitoAuthConfig";

console.log('index.jsx: Rendering App...');

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AuthProvider {...cognitoAuthConfig}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('index.jsx: No root element found!');
}