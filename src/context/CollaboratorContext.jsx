import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { generateClient } from 'aws-amplify/api';

const CollaboratorContext = createContext();
export const useCollaborators = () => useContext(CollaboratorContext);

export const CollaboratorProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [collaborators, setCollaborators] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const client = generateClient();

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchCollaborators();
    } else {
      setCollaborators([]);
    }
  }, [isAuthenticated, user?.id]);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch collaborators where user is the plan owner using Gen 2 data client
      const response = await client.models.Collaborator.list({
        filter: { planOwnerId: { eq: user.userId } }
      });
      setCollaborators(response.items || []);
    } catch (err) {
      console.error('Error fetching collaborators:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const addCollaborator = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      // Create collaborator using Gen 2 data client
      const newCollaborator = await client.models.Collaborator.create({
        email: data.email,
        role: data.role || 'viewer',
        status: 'pending',
        planOwnerId: user.userId,
        planOwnerName: user.attributes?.name || user.attributes?.email || 'Unknown User',
        farewellPlanCollaboratorsId: data.farewellPlanId,
        invitedAt: new Date().toISOString()
      });
      setCollaborators(prev => [...prev, newCollaborator]);
      return { success: true, collaborator: newCollaborator };
    } catch (err) {
      console.error('Error adding collaborator:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  const removeCollaborator = async (collaboratorId) => {
    setIsLoading(true);
    setError(null);
    try {
      // Delete collaborator using GraphQL
      await client.graphql({
        query: deleteCollaborator,
        variables: {
          input: { id: collaboratorId }
        }
      });
      
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
      return { success: true };
    } catch (err) {
      console.error('Error removing collaborator:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };
  const updateCollaboratorStatus = async (collaboratorId, updates) => {
    setIsLoading(true);
    setError(null);
    try {
      // Update collaborator using GraphQL
      const response = await client.graphql({
        query: updateCollaborator,
        variables: {
          input: {
            id: collaboratorId,
            ...updates,
            respondedAt: new Date().toISOString()
          }
        }
      });
      
      const updatedCollaborator = response.data.updateCollaborator;
      setCollaborators(prev =>
        prev.map(c => (c.id === collaboratorId ? updatedCollaborator : c))
      );
      return { success: true, collaborator: updatedCollaborator };
    } catch (err) {
      console.error('Error updating collaborator:', err);
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    collaborators,
    isLoading,
    error,
    fetchCollaborators,
    addCollaborator,
    removeCollaborator,
    updateCollaborator: updateCollaboratorStatus
  };

  return (
    <CollaboratorContext.Provider value={value}>
      {children}
    </CollaboratorContext.Provider>
  );
};

export { CollaboratorContext };
