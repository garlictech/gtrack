// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { SES } from 'aws-sdk';
import { randomDigits } from 'crypto-secure-random-digit';
import { config } from './config';

const ses = new SES();

export const handler: CognitoUserPoolTriggerHandler = async event => {
  let secretLoginCode: string;
  if (!event.request.session || !event.request.session.length) {
    // This is a new auth session
    // Generate a new secret login code and mail it to the user
    secretLoginCode = randomDigits(6).join('');
    const { callerContext } = event;
    await sendEmail(
      event.request.userAttributes.email,
      secretLoginCode,
      callerContext.clientId
    );
  } else {
    // There's an existing session. Don't generate new digits but
    // re-use the code from the current session. This allows the user to
    // make a mistake when keying in the code and to then retry, rather
    // the needing to e-mail the user an all new code again.
    const previousChallenge = event.request.session.slice(-1)[0];
    let matches: RegExpMatchArray | null = null;
    if (previousChallenge.challengeMetadata) {
      matches = previousChallenge.challengeMetadata.match(/CODE-(\d*)/);
    }
    secretLoginCode = (matches && matches[1]) || '';
  }

  // This is sent back to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email,
  };

  // Add the secret login code to the private challenge parameters
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = { secretLoginCode };

  // Add the secret login code to the session so it is available
  // in a next invocation of the "Create Auth Challenge" trigger
  event.response.challengeMetadata = `CODE-${secretLoginCode}`;

  return event;
};

const sendEmail = async (
  emailAddress: string,
  secretLoginCode: string,
  clientId: string
) => {
  let url = `${config.origin}/auth/magiclink?secret=${secretLoginCode}`;

  if (clientId === config.userPoolMobileClientId) {
    url = `${config.deepLink}/?client=${secretLoginCode}`;
  }

  const params: SES.SendEmailRequest = {
    Destination: { ToAddresses: [emailAddress] },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html>
                  <body>
                    <p>Hi!</p>
                    <p>Click on the following link to log in to gTrack:</p>
                    <a href=${url}>${url}</a>
                    <hr>
                    <p>Szia!</p>
                    <p>Kattints a linkre a belépéshez a gTrack-be:</p>
                    <a href=${url}>${url}</a>
                  </body>
                </html>`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'gTrack magic link login',
      },
    },
    Source: config.SESFromAddress || '',
  };

  await ses.sendEmail(params).promise();
};
