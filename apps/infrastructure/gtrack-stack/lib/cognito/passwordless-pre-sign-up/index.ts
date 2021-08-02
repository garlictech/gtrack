import { Logger } from '@gtrack/nodejs/shared';

export const handler: CognitoUserPoolTriggerHandler = async event => {
  Logger.debug(
    `PostConfirmation / incoming event: ${JSON.stringify(event, null, 2)}`
  );
  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  return event;
};
