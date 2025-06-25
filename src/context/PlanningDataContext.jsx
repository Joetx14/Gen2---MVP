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

export const PlanningDataProvider = ({ children }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser, isAuthenticated, isLoading: authIsLoading } = useAuth();
  const saveTimeoutRef = useRef(null);
  const client = generateClient();

  // --- CORE BACKEND SAVE FUNCTION ---
  const savePlanToBackend = useCallback(async (planDataToSave) => {
    if (!isAuthenticated || !currentUser?.userId) {
      console.log("User not authenticated. Skipping backend save.");
      return;
    }

    // Ensure all data parts are stringified for the backend model
    const planInput = {
      basicInformation: JSON.stringify(planDataToSave.basicInformation || {}),
      farewellCeremony: JSON.stringify(planDataToSave.farewellCeremony || {}),
      farewellCare: JSON.stringify(planDataToSave.farewellCare || {}),
      farewellCareDetails: JSON.stringify(planDataToSave.farewellCareDetails || {}),
      restingPlace: JSON.stringify(planDataToSave.restingPlace || {}),
      tributes: JSON.stringify(planDataToSave.tributes || {}),
      // --- FIX: Added the _metadata field to be saved ---
      _metadata: JSON.stringify(planDataToSave._metadata || { lastVisitedStep: null }),
      userID: currentUser.userId,
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
        setFormData(prev => ({ ...prev, id: newPlan.id }));
      }
      console.log("Plan successfully synced with backend.");
    } catch (err) {
      console.error('Error saving plan to backend:', err);
      setError('Could not save progress.');
    }
  }, [isAuthenticated, currentUser?.userId, client]);

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
      if (authIsLoading) return; // Wait until authentication check is complete

      if (isAuthenticated && currentUser?.userId) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await client.models.FarewellPlan.list({
            filter: { userID: { eq: currentUser.userId } }
          });

          const plans = response.data; 

          if (plans && plans.length > 0) {
            console.log("Found existing plan, loading into state.");
            const plan = plans[0];
            // --- FIX: Parse the _metadata field when loading ---
            setFormData({
              id: plan.id,
              basicInformation: JSON.parse(plan.basicInformation || '{}'),
              farewellCeremony: JSON.parse(plan.farewellCeremony || '{}'),
              farewellCare: JSON.parse(plan.farewellCare || '{}'),
              farewellCareDetails: JSON.parse(plan.farewellCareDetails || '{}'),
              restingPlace: JSON.parse(plan.restingPlace || '{}'),
              tributes: JSON.parse(plan.tributes || '{}'),
              _metadata: JSON.parse(plan._metadata || '{"lastVisitedStep":null}')
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
        // Not authenticated: clear plan data
        setFormData(initialFormData);
        setIsLoading(false);
      }
    };

    loadPlanData();
  }, [isAuthenticated, authIsLoading, currentUser?.userId, client]);

  const value = {
    formData,
    updateFormData,
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