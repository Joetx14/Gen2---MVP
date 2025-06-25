import { defineFunction } from '@aws-amplify/backend';

export const stripeWebhookHandlerFunction = defineFunction({
  name: 'stripeWebhookHandler',
  entry: './handler.ts'
});
