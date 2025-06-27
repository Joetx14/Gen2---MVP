// src/context/PlanningDataContext.jsx

import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { generateClient } from 'aws-amplify/api';

const PlanningDataContext = createContext();
export const usePlanningData = () => useContext(PlanningDataContext);

const initialFormData = {
  id: null,
  title: '',
  basicInformation: {},
  farewellCeremony: {},
  farewellCare: {},
  farewellCareDetails: {},
  restingPlace: {},
  tributes: {},
  _metadata: {
    lastVisitedStep: null
  }
};

const safeParse = (data, fallback = {}) => {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse JSON string:", data, e);
      return fallback;
    }
  }
  return data || fallback;
};

export const PlanningDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user: currentUser, isAuthenticated } = useAuth();
  const saveTimeoutRef = useRef(null);
  const client = generateClient();

  // --- CORE BACKEND SAVE FUNCTION ---
  const savePlanToBackend = useCallback(async (planDataToSave) => {
    if (!isAuthenticated || !currentUser?.userId) {
      console.log("User not authenticated or user ID missing. Skipping backend save.");
      return;
    }

    // Prepare input for create/update
    const planInput = {
      title: planDataToSave.title || 'My Farewell Plan',
      user: { id: currentUser.userId }, // ✅ Use nested user object for belongsTo
      basicInformation: planDataToSave.basicInformation || {},
      farewellCeremony: planDataToSave.farewellCeremony || {},
      farewellCare: planDataToSave.farewellCare || {},
      farewellCareDetails: planDataToSave.farewellCareDetails || {},
      restingPlace: planDataToSave.restingPlace || {},
      tributes: planDataToSave.tributes || {},
      _metadata: planDataToSave._metadata || { lastVisitedStep: null },
    };

    console.log("Attempting to save plan:", planInput);

    try {
      if (planDataToSave.id) {
        // Update existing plan (include id, but do not send user object again)
        await client.models.FarewellPlan.update({
          id: planDataToSave.id,
          ...planInput,
        });
        console.log("Plan updated successfully!");
      } else {
        // Create new plan
        const result = await client.models.FarewellPlan.create(planInput);
        const newPlan = result.data;
        if (newPlan) {
          console.log("Plan created successfully!", newPlan);
          setFormData(prev => ({
            ...prev,
            ...planDataToSave,
            id: newPlan.id
          }));
        } else {
          console.error("Create operation did not return a new plan.", result.errors);
          setError('Failed to create plan.');
        }
      }
    } catch (err) {
      console.error('Error saving plan to backend:', err);
      setError('Could not save your progress.');
    }
  }, [client, isAuthenticated, currentUser]);

  const updateFormData = useCallback((newData) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      // Debounce the save to avoid too many API calls
      saveTimeoutRef.current = setTimeout(() => {
        savePlanToBackend(updated);
      }, 2000);
      return updated;
    });
  }, [savePlanToBackend]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // --- EXPOSED: Load plan data ---
  const loadPlanData = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await client.models.FarewellPlan.list({
        filter: { user: { id: { eq: currentUser.userId } } } // ✅ Filter by nested user id
      });
      const plan = response.data?.[0];

      if (plan) {
        setFormData({
          id: plan.id,
          title: plan.title,
          basicInformation: safeParse(plan.basicInformation),
          farewellCeremony: safeParse(plan.farewellCeremony),
          farewellCare: safeParse(plan.farewellCare),
          farewellCareDetails: safeParse(plan.farewellCareDetails),
          restingPlace: safeParse(plan.restingPlace),
          tributes: safeParse(plan.tributes),
          _metadata: safeParse(plan._metadata, { lastVisitedStep: null })
        });
      } else {
        // No plan found: CREATE a new plan for this user
        const newPlanInput = {
          title: 'My Farewell Plan',
          user: { id: currentUser.userId }, // ✅ Use nested user object
          basicInformation: {},
          farewellCeremony: {},
          farewellCare: {},
          farewellCareDetails: {},
          restingPlace: {},
          tributes: {},
          _metadata: { lastVisitedStep: null }
        };
        const result = await client.models.FarewellPlan.create(newPlanInput);
        setFormData({
          ...newPlanInput,
          id: result.data.id
        });
      }
    } catch (err) {
      setError("Could not load or create your plan.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser?.userId, client]);

  // FIX #3: Automatically load data when user is authenticated.
  useEffect(() => {
    if (isAuthenticated && currentUser?.userId) {
      loadPlanData();
    }
  }, [isAuthenticated, currentUser, loadPlanData]);

  const trackStepVisit = useCallback((stepPath) => {
    setFormData(prev => ({
      ...prev,
      _metadata: {
        ...prev._metadata,
        lastVisitedStep: stepPath
      }
    }));
  }, []);

  const value = {
    formData,
    updateFormData,
    isLoading,
    error,
    loadPlanData,
    trackStepVisit
  };

  return (
    <PlanningDataContext.Provider value={value}>
      {children}
    </PlanningDataContext.Provider>
  );
};

export { PlanningDataContext };
