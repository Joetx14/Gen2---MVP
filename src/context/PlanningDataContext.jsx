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

    const planInput = {
      basicInformation: JSON.stringify(planDataToSave.basicInformation || {}),
      farewellCeremony: JSON.stringify(planDataToSave.farewellCeremony || {}),
      farewellCare: JSON.stringify(planDataToSave.farewellCare || {}),
      farewellCareDetails: JSON.stringify(planDataToSave.farewellCareDetails || {}),
      restingPlace: JSON.stringify(planDataToSave.restingPlace || {}),
      tributes: JSON.stringify(planDataToSave.tributes || {}),
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
  
  // --- NEW EXPLICIT SAVE FUNCTION ---
  // This function saves step data and tracks the current path immediately.
  // It should be used for "Save & Continue" buttons.
  const saveStepData = useCallback(async (stepData, currentPath) => {
    // Create the fully updated data object before saving.
    // This includes the new data from the current step and the new lastVisitedStep.
    const dataToSave = {
      ...formData, 
      ...stepData, 
      _metadata: {
        ...formData._metadata,
        lastVisitedStep: currentPath
      }
    };

    // Update the local state right away for a responsive UI.
    setFormData(dataToSave);

    // Call the core backend save function directly, without any delay.
    // The 'await' ensures the calling component can wait for the save to finish before navigating.
    await savePlanToBackend(dataToSave);

  }, [formData, savePlanToBackend]);


  // --- DEBOUNCED AUTO-SAVE FUNCTION (for potential future use, e.g., on text input) ---
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

          const plans = response.data; 

          if (plans && plans.length > 0) {
            console.log("Found existing plan, loading into state.");
            const plan = plans[0];
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
        setFormData(initialFormData);
        setIsLoading(false);
      }
    };

    loadPlanData();
  }, [isAuthenticated, authIsLoading, currentUser?.userId, client]);

  const value = {
    formData,
    updateFormData, // Kept for auto-saving needs
    saveStepData,   // The new function for explicit saves
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
