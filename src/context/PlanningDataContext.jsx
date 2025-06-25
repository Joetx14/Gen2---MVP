// src/context/PlanningDataContext.jsx

import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { generateClient } from 'aws-amplify/api';
import { FarewellPlan } from '../models';

const LOCAL_STORAGE_KEY = 'farewell-planning-data';
const PlanningDataContext = createContext();
export const usePlanningData = () => useContext(PlanningDataContext);

const initialFormData = {
  // Your initial empty form data structure...
  id: null, // Ensure ID is part of the initial state
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
  const saveTimeoutRef = useRef(null); // Ref to hold the timeout for debouncing
  const client = generateClient();

  // --- CORE BACKEND SAVE FUNCTION ---
  // This is the single function responsible for the actual API call.
  const savePlanToBackend = useCallback(async (planDataToSave) => {
    if (!isAuthenticated || !currentUser?.userId) {
      console.log("User not authenticated. Skipping backend save.");
      return; // Do not save if user is not logged in
    }

    // Associate the plan with the logged-in user
    const planInput = {
      basicInformation: JSON.stringify(planDataToSave.basicInformation || {}),
      farewellCeremony: JSON.stringify(planDataToSave.farewellCeremony || {}),
      farewellCare: JSON.stringify(planDataToSave.farewellCare || {}),
      farewellCareDetails: JSON.stringify(planDataToSave.farewellCareDetails || {}),
      restingPlace: JSON.stringify(planDataToSave.restingPlace || {}),
      tributes: JSON.stringify(planDataToSave.tributes || {}),
      userID: currentUser.userId,
    };

    try {
      if (planDataToSave.id) {
        // If plan has an ID, update it using Gen 2 data client
        console.log("Updating existing plan in backend...");
        await client.models.FarewellPlan.update({
          id: planDataToSave.id,
          ...planInput
        });
      } else {
        // If no ID, create a new plan using Gen 2 data client
        console.log("Creating new plan in backend...");
        const newPlan = await client.models.FarewellPlan.create(planInput);
        // IMPORTANT: Update local state with the new ID from the database
        setFormData(prev => ({ ...prev, id: newPlan.id }));
      }
      console.log("Plan successfully synced with backend.");
    } catch (err) {
      console.error('Error saving plan to backend:', err);
      setError('Could not save progress.');
    }
  }, [isAuthenticated, currentUser?.userId]);


  // --- DEBOUNCED AUTO-SAVE FUNCTION ---
  // This function updates the local state immediately and then saves to the backend after a delay.
  const updateFormData = useCallback((newData) => {
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = setTimeout(() => {
        savePlanToBackend(updated);
      }, 2000);
      return updated;
    });
  }, [savePlanToBackend]);


  // --- TRACK STEP VISIT FUNCTION ---
  // This function's only job is to update the metadata in the local state.
  const trackStepVisit = useCallback((path) => {
    setFormData(prev => {
      if (prev._metadata.lastVisitedStep === path) {
        return prev; // No update needed, prevents loop
      }
      const updated = {
        ...prev,
        _metadata: {
          ...prev._metadata,
          lastVisitedStep: path,
        },
      };
      // Debounced save will be triggered by updateFormData
      updateFormData(updated);
      return updated;
    });
  }, [updateFormData]);


  // Effect to fetch initial data when auth state is known
  useEffect(() => {
    const loadPlanData = async () => {
      if (authIsLoading) return;

      if (isAuthenticated && currentUser?.userId) {
        setIsLoading(true);
        try {
          const response = await client.graphql({
            query: listFarewellPlans,
            variables: { filter: { userID: { eq: currentUser.userId } } }
          });
          const plans = response.data.listFarewellPlans.items;
          if (plans.length > 0) {
            // Parse the plan data from backend (assuming stringified fields)
            const plan = plans[0];
            const parsedPlanData = {
              ...plan,
              basicInformation: JSON.parse(plan.basicInformation || '{}'),
              farewellCeremony: JSON.parse(plan.farewellCeremony || '{}'),
              farewellCare: JSON.parse(plan.farewellCare || '{}'),
              farewellCareDetails: JSON.parse(plan.farewellCareDetails || '{}'),
              restingPlace: JSON.parse(plan.restingPlace || '{}'),
              tributes: JSON.parse(plan.tributes || '{}'),
              _metadata: plan._metadata || { lastVisitedStep: null }
            };
            setFormData(parsedPlanData);
          } else {
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
      }
    };

    loadPlanData();
  }, [isAuthenticated, authIsLoading, currentUser?.userId]);


  const value = {
    formData,
    updateFormData,
    savePlanToBackend, // Keep this exported for explicit saves if needed elsewhere
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
