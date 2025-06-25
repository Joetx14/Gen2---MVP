import { defineFunction } from '@aws-amplify/backend';

/**
 * Defines the sendCollaboratorInvite Lambda function resource.
 * This function is responsible for sending invitation emails to new collaborators.
 */
export const sendCollaboratorInvite = defineFunction({
  // The name of the function, can be used to reference it elsewhere
  name: 'sendCollaboratorInvite',
  
  // Set environment variables for the function
  // These are more secure and flexible than hardcoding values.
  environment: {
    // IMPORTANT: Replace with your app's production URL
    FRONTEND_URL: 'https://main.d39gieywm2elvx.amplifyapp.com', 
    
    // IMPORTANT: Replace with the email address you have verified in Amazon SES
    SES_FROM_ADDRESS: 'support@your-domain.com', 
  },
});
