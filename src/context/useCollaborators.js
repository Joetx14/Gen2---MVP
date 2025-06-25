import { useContext } from 'react';
import { CollaboratorContext } from './CollaboratorContext';

export function useCollaborators() {
  return useContext(CollaboratorContext);
}
