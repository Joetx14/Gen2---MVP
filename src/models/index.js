// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, FarewellPlan, Collaborator } = initSchema(schema);

export {
  User,
  FarewellPlan,
  Collaborator
};