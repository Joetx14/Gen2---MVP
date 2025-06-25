import { useContext } from 'react';
import { PlanningDataContext } from './PlanningDataContext';

export function usePlanningData() {
  return useContext(PlanningDataContext);
}
