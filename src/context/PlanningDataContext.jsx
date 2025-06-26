// src/context/PlanningDataContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
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

// Helper function to safely parse data
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const saveTimeoutRef = useRef(null);
  const client = generateClient();

  // --- DEFINITIVE FIX: Use a ref to track the latest auth state ---
  // This ref will always hold the most current authentication status,
  // preventing our save function from using a "stale" value during fast re-renders.
  const authStateRef = useRef({ isAuthenticated, currentUser });
  useEffect(() => {
    authStateRef.current = { isAuthenticated, currentUser };
  }, [isAuthenticated, currentUser]);


  // --- CORE BACKEND SAVE FUNCTION (NOW MORE ROBUST) ---
  const savePlanToBackend = useCallback(async (planDataToSave) => {
    // Read the LATEST auth state from the ref, which prevents the race condition.
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
        console.log("Attempting to UPDATE plan in backend:", planDataToSave.id);
        await client.models.FarewellPlan.update({
          id: planDataToSave.id,
          ...planInput
        });
      } else {
        console.log("Attempting to CREATE new plan in backend...");
        const newPlan = await client.models.FarewellPlan.create(planInput);
        
        setFormData(prev => ({
            ...prev,
            ...planDataToSave,
            id: newPlan.id
        }));
      }
      console.log("Plan successfully synced with backend.");
    } catch (err) {
      console.error('Error saving plan to backend:', err);
      setError('Could not save progress.');
    }
  }, [client]); // The function no longer depends on changing auth state, making it stable.
  
  // --- EXPLICIT SAVE FUNCTION ---
  const saveStepData = useCallback(async (stepData, currentPath) => {
  const dataToSave = {
    ...formData,
    ...stepData,
    _metadata: {
      ...formData._metadata,
      lastVisitedStep: currentPath
    }
  };

  setFormData(dataToSave); // immediate local update
  await savePlanToBackend(dataToSave); // immediate backend write
}, [formData, savePlanToBackend]);

  // --- DEBOUNCED AUTO-SAVE FUNCTION ---
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

  // --- TRACK STEP VISIT FUNCTION ---
  const trackStepVisit = useCallback((path) => {
    updateFormData({
        _metadata: {
          lastVisitedStep: path,
        },
      });
  }, [updateFormData]);


  // --- EFFECT TO FETCH INITIAL DATA ---
  useEffect(() => {
    const loadPlanData = async () => {
      if (authIsLoading) return;

      if (isAuthenticated && currentUser?.userId) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await client.models.FarewellPlan.list({
            filter: { userID: { eq: currentUser.userId } }
          });
          const plan = response.data?.[0];

          if (plan) {
            console.log("Found existing plan, loading into state.");
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
            console.log("No existing plan found. Initializing new plan data.");
            setFormData(initialFormData);
          }
        } catch (err) {
          console.error("Error fetching plan from backend:", err);
          setError("Could not load your plan.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setFormData(initialFormData);
        setIsLoading(false);
      }
    };

    loadPlanData();
  }, [isAuthenticated, authIsLoading, currentUser?.userId, client]);

  const value = {
    formData,
    updateFormData,
    saveStepData,
    trackStepVisit,
    isLoading,
    error
  };

  return (
    <PlanningDataContext.Provider value={value}>
      {children}
    </PlanningDataContext.Provider>
  );
};

export { PlanningDataContext };