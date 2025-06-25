// src/components/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../../context/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. While the auth state is loading, show a loading indicator.
  if (isLoading) {
    return <div className="app-loading">Loading...</div>;
  }

  // 2. If the user is NOT authenticated, redirect them to the login page.
  if (!isAuthenticated) {
    // We save the location they were trying to go to so we can redirect
    // them back after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If the user IS authenticated, render the component they were trying to access.
  return children;
};

export default ProtectedRoute;