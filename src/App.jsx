import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PlanningDataProvider } from './context/PlanningDataContext';
import { CollaboratorProvider } from './context/CollaboratorContext';
import { PaymentProvider } from './context/Payment';
import AppRoutes from './AppRoutes'; // Import the dedicated router
import { useAuth } from "react-oidc-context";

// Amplify Configuration
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
Amplify.configure(outputs);

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "16k4r79a3tppn183d15p5htvf8";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_wWfPcTd2f";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>
        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>
  );
}

export default App;
