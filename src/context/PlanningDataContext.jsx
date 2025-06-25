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
        // --- DEFINITIVE FIX ---
        // This ensures the state is updated with the data that was just saved, plus the new ID.
        // This prevents the race condition.
        setFormData({ ...planDataToSave, id: newPlan.data.id });
      }
      console.log("Plan successfully synced with backend.");
    } catch (err) {
      console.error('Error saving plan to backend:', err);
      setError('Could not save progress.');
    }
  }, [isAuthenticated, currentUser?.userId, client]);
  
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
    setFormData(dataToSave);
    await savePlanToBackend(dataToSave);
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
