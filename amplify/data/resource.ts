import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// The entire schema is defined inside this 'a.schema({})' block.
const schema: any = a.schema({
  User: a.model({
    email: a.string().required(),
    firstName: a.string(),
    lastName: a.string(),
    isActive: a.boolean(),
    lastLogin: a.datetime(),
    farewellPlans: a.hasMany('FarewellPlan', 'userId'),
    // The 'collaborations' field has been removed to solve a data model conflict.
  })
  .authorization((allow) => [
    allow.owner(),
    allow.authenticated('userPools').to(['read']),
  ]), // <-- Comma after the User model definition

  FarewellPlan: a.model({
    title: a.string().required(),
    userId: a.id().required(), 
    user: a.belongsTo('User', 'userId'),
    basicInformation: a.json(),
    farewellCeremony: a.json(),
    farewellCare: a.json(),
    farewellCareDetails: a.json(),
    restingPlace: a.json(),
    tributes: a.json(),
    collaborators: a.hasMany('Collaborator', 'farewellPlanId'),
    isSharedWithCollaborators: a.boolean(),
    shareCode: a.string(),
    isComplete: a.boolean(),
  })
  .authorization((allow) => [
    allow.owner(),
    allow.authenticated('userPools').to(['read']),
  ]), // <-- Comma after the FarewellPlan model definition

  Collaborator: a.model({
    email: a.string().required(),
    role: a.string(),
    status: a.string(),
    farewellPlanId: a.id().required(),
    farewellPlan: a.belongsTo('FarewellPlan', 'farewellPlanId'),
    // Changed to a.string() to allow for auth rule comparison.
    userId: a.string(),
    // This field is for the plan owner's authorization
    planOwnerId: a.id().required(),
    invitedAt: a.datetime().required(),
    respondedAt: a.datetime(),
    lastAccessedAt: a.datetime(),
  })
 .authorization((allow) => [
  allow.owner().to(['create', 'read', 'update', 'delete']),
  // You can add more authorization rules here if needed
  // For example: allow.authenticated('userPools').to(['read']),
  // Make sure to add a comma if you add more rules
  // Remove the comma after the last rule
]),

}); // <-- Add this closing brace to end the a.schema({ ... }) block

// Defines the client-side schema type for your frontend code.
export type Schema = typeof schema;

// Exports the data configuration for Amplify to build the backend.
export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: 'userPool' },
});