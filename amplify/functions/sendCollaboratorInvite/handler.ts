import type { DynamoDBStreamHandler } from 'aws-lambda';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';
import { unmarshall } from '@aws-sdk/util-dynamodb';

// Initialize the SES client. The region will be automatically detected from the environment.
const sesClient = new SESv2Client({});

/**
 * This handler is triggered by a DynamoDB stream from the Collaborator table.
 * When a new collaborator is added (an INSERT event), it sends them an invitation email.
 * * @param event The DynamoDB stream event
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log(`Processing ${event.Records.length} records...`);

  // Process each record in the event batch
  for (const record of event.Records) {
    // We only care about new collaborators being added
    if (record.eventName !== 'INSERT' || !record.dynamodb?.NewImage) {
      console.log(`Skipping record with eventName: ${record.eventName}`);
      continue;
    }

    try {
      // The NewImage is the full DynamoDB record of the new collaborator.
      // We unmarshall it to a regular JavaScript object.
      const newCollaborator = unmarshall(record.dynamodb.NewImage as any);

      console.log('Processing new collaborator:', newCollaborator);

      // --- Construct the unique invitation link ---
      const inviteId = newCollaborator.id; // The ID of the collaborator record
      const frontendUrl = process.env.FRONTEND_URL;
      const recipientEmail = newCollaborator.email;
      const inviterName = newCollaborator.planOwnerName || 'A friend'; // Get the inviter's name

      // Validate that we have the necessary information
      if (!inviteId || !recipientEmail || !frontendUrl) {
        console.error('Missing required data to send invite', { inviteId, recipientEmail, frontendUrl });
        continue; // Skip to the next record
      }

      const inviteLink = `${frontendUrl}/accept-invite/${inviteId}`;
      const fromAddress = process.env.SES_FROM_ADDRESS;

      // --- Create the email content ---
      const emailSubject = `${inviterName} has invited you to a Farewell Plan`;
      const emailBodyHtml = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; color: #333; }
              .container { padding: 20px; border: 1px solid #ddd; border-radius: 5px; max-width: 600px; margin: auto; }
              .button { display: inline-block; padding: 12px 24px; background-color: #4A6572; color: white !important; text-decoration: none; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>You're Invited!</h2>
              <p><strong>${inviterName}</strong> has invited you to view and collaborate on a Farewell Plan.</p>
              <p>Click the link below to accept the invitation. You will be asked to create an account or log in.</p>
              <p>
                <a href="${inviteLink}" class="button">Accept Invitation</a>
              </p>
              <p>If you were not expecting this invitation, you can safely ignore this email.</p>
              <hr/>
              <p><small>This is an automated message from Farewell Finder.</small></p>
            </div>
          </body>
        </html>
      `;

      // --- Prepare and send the email using SES ---
      const sendEmailCommand = new SendEmailCommand({
        FromEmailAddress: fromAddress,
        Destination: { ToAddresses: [recipientEmail] },
        Content: {
          Simple: {
            Subject: { Data: emailSubject, Charset: 'UTF-8' },
            Body: {
              Html: { Data: emailBodyHtml, Charset: 'UTF-8' },
            },
          },
        },
      });

      await sesClient.send(sendEmailCommand);
      console.log(`Invitation email sent successfully to ${recipientEmail}`);

    } catch (error) {
      console.error('Error processing record:', JSON.stringify(record, null, 2));
      console.error(error);
      // Continue to the next record even if one fails
    }
  }
};