import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PlanningDataProvider } from './context/PlanningDataContext';
import { CollaboratorProvider } from './context/CollaboratorContext';
import { PaymentProvider } from './context/Payment';
import AppRoutes from './AppRoutes'; // Import the dedicated router
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
import { Auth } from 'aws-amplify';

Amplify.configure(outputs);

function App() {
  const handleSignIn = () => {
    Auth.federatedSignIn(); // Redirects to Cognito Hosted UI
  };

  const handleSignOut = () => {
    Auth.signOut(); // Signs out and redirects to sign-out URL
  };

  return (
    <AuthProvider>
      <PlanningDataProvider>
        <CollaboratorProvider>
          <PaymentProvider>
            <button onClick={handleSignIn}>Sign In</button>
            <button onClick={handleSignOut}>Sign Out</button>
            <AppRoutes />
          </PaymentProvider>
        </CollaboratorProvider>
      </PlanningDataProvider>
    </AuthProvider>
  );
}

export default App;
