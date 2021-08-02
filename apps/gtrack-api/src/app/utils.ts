import { objectLogger } from '@bit/garlictech.nestjs.shared.utils';
import { Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { AdminCreateUserResponse } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import * as _ from 'lodash';
import { bindNodeCallback, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { v1 as uuid } from 'uuid';

const cognito = new AWS.CognitoIdentityServiceProvider();

export const createAnonymUser = ({
  email = `${uuid()}@a.com`
} = {}): Observable<any> => {
  Logger.debug(`Creating an anonym user...`);
  // eslint:disable-next-line:no-hardcoded-credentials
  const password = '123456789aA.';
  const createUserParams: any = {
    DesiredDeliveryMediums: [],
    UserAttributes: [
      {
        Name: 'email_verified',
        Value: 'true'
      },
      {
        Name: 'email',
        Value: email
      }
    ],
    Username: email,
    ForceAliasCreation: false,
    UserPoolId: process.env.USERPOOL_ID,
    MessageAction: 'SUPPRESS',
    TemporaryPassword: password
  };

  const initiateAuthParams = {
    AuthFlow: 'ADMIN_NO_SRP_AUTH',
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    },
    UserPoolId: process.env.USERPOOL_ID,
    ClientId: process.env.USERPOOL_CLIENT_ID
  };

  const respondToAuthChallengeParams = {
    UserPoolId: process.env.USERPOOL_ID,
    ClientId: process.env.USERPOOL_CLIENT_ID,
    ChallengeName: 'NEW_PASSWORD_REQUIRED',
    ChallengeResponses: {
      USERNAME: email,
      PASSWORD: password,
      NEW_PASSWORD: password
    }
  };

  let username: string | undefined;

  return bindNodeCallback((params: any, callback: any) =>
    cognito.adminCreateUser(params, callback)
  )(createUserParams).pipe(
    x => x as Observable<AdminCreateUserResponse>,
    objectLogger('Anonym user created'),
    tap(({ User }) => (username = User?.Username)),
    switchMap(() =>
      bindNodeCallback((params: any, callback: any) =>
        cognito.adminInitiateAuth(params, callback)
      )(initiateAuthParams)
    ),
    objectLogger('Auth initiated'),
    switchMap((response: any) =>
      bindNodeCallback((params: any, callback: any) =>
        cognito.adminRespondToAuthChallenge(params, callback)
      )({
        ...respondToAuthChallengeParams,
        Session: response.Session
      })
    ),
    objectLogger('Auth challenge replied'),
    map(response => ({
      username,
      password,
      idToken: _.get(response, 'AuthenticationResult.IdToken')
    }))
  );
};
