import { Auth as AuthData } from '@gtrack/shared/authentication/data-access';
import { CognitoIdToken } from 'amazon-cognito-identity-js';

export const createAuthDataFromToken = (token: CognitoIdToken): AuthData => {
  const decoded = token.decodePayload();

  return {
    token: token.getJwtToken(),
    user: {
      id: decoded.sub,
      customerId: decoded['custom:customerID'],
      email: decoded.email,
      roles: decoded.roles.split(','),
    },
  };
};
