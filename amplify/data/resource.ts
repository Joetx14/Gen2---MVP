import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
* This schema defines the data models for a farewell planning application.
* It includes models for Users, FarewellPlans, and Collaborators,
* with relationships and authorization rules set up.
*
* Note: The `id`, `createdAt`, and `updatedAt` fields are automatically
* added to each model by Amplify and do not need to be explicitly defined.
*/
function collaboratorAuthorization(ctx: { identity?: { sub?: string }, item?: { planOwnerId?: string, userId?: string }, operation?: string }) {
  const isOwner = ctx.identity?.sub === ctx.item?.planOwnerId;
  const isCollaborator = ctx.identity?.sub === ctx.item?.userId;
  if (isOwner) {
    // Owner can do anything
    return { allow: true };
  }
  if (isCollaborator && ctx.operation === 'read') {
    // Collaborator can only read
    return { allow: true };
  }
  // Otherwise, deny
  return { allow: false };
}

const schema = a.schema({
  User: a.model({
    email: a.string().required(),
    firstName: a.string(),
    lastName: a.string(),
    isActive: a.boolean(),
    lastLogin: a.datetime(),
    farewellPlans: a.hasMany('FarewellPlan', 'userId'),
    collaborations: a.hasMany('Collaborator', 'userId'),
  })
  .authorization((allow) => [
    allow.owner(),
    allow.authenticated('userPools').to(['read']),
  ]),

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
  ]),

  Collaborator: a.model({
    email: a.string().required(),
    role: a.string(),
    status: a.string(),
    farewellPlanId: a.id().required(),
    farewellPlan: a.belongsTo('FarewellPlan', 'farewellPlanId'),
    userId: a.id(),
    user: a.belongsTo('User', 'userId'),
  })
  .authorization((allow) => [
    allow.owner(),
  ]),
});

// Defines the client-side schema type for your frontend code.
export type Schema = ClientSchema<typeof schema>;

// Exports the data configuration for Amplify to build the backend.
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
