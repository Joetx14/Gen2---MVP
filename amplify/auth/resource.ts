import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your new auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const authV2 = defineAuth({
  loginWith: {
    email: true,
  },
});
