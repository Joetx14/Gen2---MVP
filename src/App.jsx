import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { PlanningDataProvider } from './context/PlanningDataContext';
import { CollaboratorProvider } from './context/CollaboratorContext';
import { PaymentProvider } from './context/Payment';
import AppRoutes from './AppRoutes'; // Import the dedicated router

// Amplify Configuration
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';
Amplify.configure(outputs);

function App() {
  return (
    <AuthProvider>
      <PlanningDataProvider>
        <CollaboratorProvider>
          <PaymentProvider>
            {/* All providers now wrap your single AppRoutes component */}
            <AppRoutes />
          </PaymentProvider>
        </CollaboratorProvider>
      </PlanningDataProvider>
    </AuthProvider>
  );
}

export default App;
