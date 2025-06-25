import { defineFunction } from '@aws-amplify/backend';

export const createStripePaymentIntentFunction = defineFunction({
  name: 'createStripePaymentIntent',
  entry: './handler.ts'
});
