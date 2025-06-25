import { defineFunction } from '@aws-amplify/backend';

export const autoConfirmUserFunction = defineFunction({
  name: 'autoConfirmUser',
  entry: './handler.ts'
});
