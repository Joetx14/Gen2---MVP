import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any unauthenticated user can "create", "read", "update", 
and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  User: a
    .model({
      email: a.string(),
      firstName: a.string({ optional: true }),
      lastName: a.string({ optional: true }),
      isActive: a.boolean({ optional: true }),
      lastLogin: a.datetime({ optional: true }),
      farewellPlans: a.hasMany('FarewellPlan', 'userFarewellPlansId'),
      collaborations: a.hasMany('Collaborator', 'userCollaborationsId'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner({ provider: 'userPools', operations: ['read', 'update', 'delete'], identityClaim: 'cognito:username' }),
      allow.private({ provider: 'userPools', operations: ['read'] }),
    ])
    .key(['email'], { name: 'byEmail', queryField: 'getUserByEmail' }),

  FarewellPlan: a
    .model({
      title: a.string(),
      user: a.belongsTo('User', 'userFarewellPlansId'),
      userFarewellPlansId: a.id({ optional: true }),
      basicInformation: a.json({ optional: true }),
      farewellCeremony: a.json({ optional: true }),
      farewellCare: a.json({ optional: true }),
      farewellCareDetails: a.json({ optional: true }),
      restingPlace: a.json({ optional: true }),
      tributes: a.json({ optional: true }),
      collaborators: a.hasMany('Collaborator', 'farewellPlanCollaboratorsId'),
      isSharedWithCollaborators: a.boolean({ optional: true }),
      shareCode: a.string({ optional: true }),
      isComplete: a.boolean({ optional: true }),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner({ provider: 'userPools', operations: ['create', 'read', 'update', 'delete'], identityClaim: 'cognito:username' }),
      allow.private({ provider: 'userPools', operations: ['read'] }),
    ]),

  Collaborator: a
    .model({
      email: a.string(),
      role: a.string({ optional: true }),
      status: a.string({ optional: true }),
      farewellPlan: a.belongsTo('FarewellPlan', 'farewellPlanCollaboratorsId'),
      user: a.belongsTo('User', 'userCollaborationsId'),
      planOwnerId: a.id(),
      userId: a.id({ optional: true }),
      invitedAt: a.datetime(),
      respondedAt: a.datetime({ optional: true }),
      lastAccessedAt: a.datetime({ optional: true }),
      farewellPlanCollaboratorsId: a.id({ optional: true }),
      userCollaborationsId: a.id({ optional: true }),
      createdAt: a.datetime({ optional: true }),
      updatedAt: a.datetime({ optional: true }),
    })
    .authorization((allow) => [
      allow.owner({ provider: 'userPools', ownerField: 'planOwnerId', operations: ['create', 'read', 'update', 'delete'], identityClaim: 'cognito:username' }),
      allow.owner({ provider: 'userPools', ownerField: 'userId', operations: ['read'], identityClaim: 'cognito:username' }),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool', // Use Cognito User Pool for authenticated access
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
