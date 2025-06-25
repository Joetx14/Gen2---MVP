/// amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
// Ensure the file './auth/resource.ts' exists and exports 'auth'
import { data } from './data/resource';
import { authV2 } from './auth/resource';

import { autoConfirmUserFunction } from './functions/autoConfirmUser/resource';
import { sendCollaboratorInvite } from './functions/sendCollaboratorInvite/resource';
import { createStripePaymentIntentFunction } from './functions/createStripePaymentIntent/resource';
import { stripeWebhookHandlerFunction } from './functions/stripeWebhookHandler/resource';



export default defineBackend({
  auth: authV2,
  data,
  autoConfirmUserFunction,
  sendCollaboratorInvite,
  createStripePaymentIntentFunction,
  stripeWebhookHandlerFunction,
});