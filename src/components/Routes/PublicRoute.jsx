// src/components/PublicRoute.jsx

import React from 'react';
import { useAuth } from '../../context/useAuth';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="app-loading">Loading...</div>;
  }

  // If the user IS authenticated, redirect them away from public-only pages.
  if (isAuthenticated) {
    return <Navigate to="/confirm-wishes" replace />; // Or to their dashboard
  }

  // If the user is NOT authenticated, render the public page (e.g., Login form).
  return children;
};

export default PublicRoute;