import { CognitoIdentityServiceProvider } from 'aws-sdk';

const cognitoISP = new CognitoIdentityServiceProvider();

export const handler: CognitoUserPoolTriggerHandler = async event => {
  const roles = await cognitoISP
    .adminGetUser({
      UserPoolId: event.userPoolId,
      Username: event.userName || '',
    })
    .promise()
    .then(
      res =>
        res &&
        res.UserAttributes &&
        res.UserAttributes.find(attr => attr.Name === 'custom:roles')
    )
    .catch(err => err);

  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      roles: (roles && roles.Value) || 'user',
    },
  };

  return event;
};
