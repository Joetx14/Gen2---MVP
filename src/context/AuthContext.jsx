// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { Amplify } from "aws-amplify";
import { Hub } from "aws-amplify/utils";
import { signIn, signOut, signUp, getCurrentUser } from "aws-amplify/auth";
import awsExports from "../aws-exports";
import { generateClient } from "aws-amplify/api";
import { User } from "../models";

// Load your Amplify configuration so Auth knows your region, pool IDs, etc.
Amplify.configure(awsExports);

export const AuthContext = createContext(null);

/**
 * Custom hook that lets any component read auth state and actions.
 * Must be used inside an <AuthProvider>.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Wrap your app in <AuthProvider> so all children can access auth state.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const client = generateClient();

  // Check Cognito for an existing session (with retry logic)
  const checkUser = async () => {
    if (!isLoading) setIsLoading(true);
    try {
      let attempts = 0;
      let cognitoUser = null;
      let payload = null;

      // Retry up to 5 times
      while (attempts < 5) {
        cognitoUser = await getCurrentUser();
        payload = cognitoUser?.signInUserSession?.idToken?.payload;

        if (payload?.sub) break;

        await new Promise((res) => setTimeout(res, 500));
        attempts++;
      }

      if (!payload?.sub) {
        throw new Error("Missing sub (user ID) from Cognito token after retry.");
      }

      const userInfo = {
        userId: payload.sub,
        email: payload.email,
        name: payload.name || "",
      };

      setUser(userInfo);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("checkUser failed:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for Amplify auth events and re-check when they occur
  useEffect(() => {
    const hubListener = (data) => {
      const event = data.payload.event;
      if (event === "signIn" || event === "signedIn") {
        checkUser();
      }
      if (event === "signOut" || event === "signedOut") {
        setUser(null);
        setIsAuthenticated(false);
      }
    };
    const unsubscribe = Hub.listen("auth", hubListener);
    checkUser();
    return () => unsubscribe();
  }, []);

  // Called to log in an existing user
  const login = async (email, password) => {
    try {
      setError(null);
      await signIn(email, password);
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
      return { success: false, error: err };
    }
  };

  // Called to sign up a new user and create a User record in the database
  const register = async (email, password, attributes = {}) => {
    try {
      setError(null);
      // Sign up with Cognito
      await signUp({
        username: email,
        password,
        options: { userAttributes: attributes },
      });
      // Create user in the database (Gen 2 data client)
      await client.models.User.create({
        email,
        ...attributes,
      });
      return { success: true };
    } catch (err) {
      setError(err.message || "Registration failed");
      return { success: false, error: err };
    }
  };

  // Log out the current user
  const logout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register, // Expose the new register function
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}