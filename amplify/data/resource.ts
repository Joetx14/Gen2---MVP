import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*
* This schema defines the data models for a farewell planning application.
* It includes models for Users, FarewellPlans, and Collaborators,
* with relationships and authorization rules set up.
*
* Note: The `id`, `createdAt`, and `updatedAt` fields are automatically
* added to each model by Amplify and do not need to be explicitly defined.
*/
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
    // User can read, update, and delete their own record
    allow.owner(),
    // Other authenticated users can read user profiles
    allow.authenticated().to(['read']),
  ]),
  // To add a secondary index, use Amplify Studio or supported schema syntax.

  FarewellPlan: a.model({
    title: a.string().required(),
    userId: a.id().required(), // Foreign key to the User who owns the plan
    user: a.belongsTo('User', 'userId'), // The User object who owns this plan

    // Using a.json() for flexible, unstructured data. These are all optional.
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
    // The plan owner can perform all operations on their plan
    allow.owner(),
    // Other authenticated users can read plans
    allow.authenticated().to(['read']),
  ]),

  Collaborator: a.model({
    email: a.string().required(), // The email of the invited collaborator
    role: a.string(),
    status: a.string(), // e.g., 'INVITED', 'ACCEPTED'

    farewellPlanId: a.id().required(), // Foreign key to the FarewellPlan
    farewellPlan: a.belongsTo('FarewellPlan', 'farewellPlanId'), // The plan they are collaborating on

    // The `userId` is optional because a collaborator might be invited
    // via email before they have an account in the system.
    userId: a.id(),
    user: a.belongsTo('User', 'userId'),

    // This is the ID of the FarewellPlan's owner. It's used for authorization.
    planOwnerId: a.id().required(),

    invitedAt: a.datetime().required(),
    respondedAt: a.datetime(),
    lastAccessedAt: a.datetime(),
  })
  .authorization((allow) => [
    // The owner of the plan can manage the collaborators for that plan
    allow.owner(),
    // The collaborator (if they are a registered user) can read their own collaboration record
    allow.owner().to(['read']),
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