// src/context/PlanningDataContext.jsx

import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { generateClient } from 'aws-amplify/api';

const PlanningDataContext = createContext();
export const usePlanningData = () => useContext(PlanningDataContext);

const initialFormData = {
  id: null,
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

  const authStateRef = useRef({ isAuthenticated, currentUser });
  React.useEffect(() => {
    authStateRef.current = { isAuthenticated, currentUser };
  }, [isAuthenticated, currentUser]);

  // --- CORE BACKEND SAVE FUNCTION ---
  const savePlanToBackend = useCallback(async (planDataToSave) => {
    const { isAuthenticated: isAuthNow, currentUser: userNow } = authStateRef.current;
    if (!isAuthNow || !userNow?.userId) {
      console.log("User not authenticated or user ID missing. Skipping backend save.");
      return;
    }
    const planInput = {
      basicInformation: JSON.stringify(planDataToSave.basicInformation || {}),
      farewellCeremony: JSON.stringify(planDataToSave.farewellCeremony || {}),
      farewellCare: JSON.stringify(planDataToSave.farewellCare || {}),
      farewellCareDetails: JSON.stringify(planDataToSave.farewellCareDetails || {}),
      restingPlace: JSON.stringify(planDataToSave.restingPlace || {}),
      tributes: JSON.stringify(planDataToSave.tributes || {}),
      _metadata: JSON.stringify(planDataToSave._metadata || { lastVisitedStep: null }),
      userID: userNow.userId,
    };
    try {
      if (planDataToSave.id) {
        await client.models.FarewellPlan.update({
          id: planDataToSave.id,
          ...planInput
        });
      } else {
        const newPlan = await client.models.FarewellPlan.create(planInput);
        setFormData(prev => ({
          ...prev,
          ...planDataToSave,
          id: newPlan.id
        }));
      }
    } catch (err) {
      console.error('Error saving plan to backend:', err);
      setError('Could not save progress.');
    }
  }, [client]);

  const saveStepData = useCallback(async (stepData, currentPath) => {
    const dataToSave = {
      ...formData,
      ...stepData,
      _metadata: {
        ...formData._metadata,
        lastVisitedStep: currentPath
      }
    };
    setFormData(dataToSave);
    await savePlanToBackend(dataToSave);
  }, [formData, savePlanToBackend]);

  const updateFormData = useCallback((newData) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
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

  const trackStepVisit = useCallback((path) => {
    if (formData._metadata?.lastVisitedStep === path) return;
    const updated = {
      ...formData,
      _metadata: {
        ...formData._metadata,
        lastVisitedStep: path,
      },
    };
    updateFormData(updated);
  }, [formData, updateFormData]);

  // --- EXPOSED: Load plan data only when called ---
  const loadPlanData = useCallback(async () => {
    if (!isAuthenticated || !currentUser?.userId) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await client.models.FarewellPlan.list({
        filter: { userID: { eq: currentUser.userId } }
      });
      const plan = response.data?.[0];
      if (plan) {
        setFormData({
          id: plan.id,
          basicInformation: safeParse(plan.basicInformation),
          farewellCeremony: safeParse(plan.farewellCeremony),
          farewellCare: safeParse(plan.farewellCare),
          farewellCareDetails: safeParse(plan.farewellCareDetails),
          restingPlace: safeParse(plan.restingPlace),
          tributes: safeParse(plan.tributes),
          _metadata: safeParse(plan._metadata, { lastVisitedStep: null })
        });
      } else {
        setFormData(initialFormData);
      }
    } catch (err) {
      console.error("Error fetching plan from backend:", err);
      setError("Could not load your plan.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, currentUser?.userId, client]);

  const value = {
    formData,
    updateFormData,
    saveStepData,
    trackStepVisit,
    isLoading,
    error,
    loadPlanData // <-- expose this
  };

  return (
    <PlanningDataContext.Provider value={value}>
      {children}
    </PlanningDataContext.Provider>
  );
};

export { PlanningDataContext };