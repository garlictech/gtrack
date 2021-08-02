import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { bindNodeCallback, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AdminModel } from '../lib/admin.model';
import { config } from './config';

const cognitoISP = new CognitoIdentityServiceProvider();

export const handler: CognitoUserPoolTriggerHandler = async event => {
  const adminClientId = config.userPoolAdminClientId;
  if (event.callerContext.clientId === adminClientId) {
    Logger.debug(
      `User attributes: ${JSON.stringify(event.request.userAttributes)}`
    );
    const roles = await getUserRoles(event.request.userAttributes.email);

    if (!roles.includes('admin')) {
      throw new Error('Cannot login as admin');
    }

    if (event.userName) {
      await updateRoles(event.userName, event.userPoolId, roles);
    }

    return event;
  }

  if (event.userName) {
    await updateRoles(event.userName, event.userPoolId, ['user']);
  }

  return event;
};

Logger.debug(`Using table ${config.dynamodb.tables.admins}`);

const getUserRoles = async (email: string) =>
  bindNodeCallback((cb: any) => AdminModel.query(email).exec(cb))()
    .pipe(
      map((result: any) => result.Items[0].attrs.roles),
      catchError(err => {
        Logger.error(`Cannot pre-authenticate: ${err}`);
        return of([]);
      })
    )
    .toPromise();

const updateRoles = async (
  username: string,
  poolId: string,
  roles: string[]
) => {
  return cognitoISP
    .adminUpdateUserAttributes({
      Username: username,
      UserPoolId: poolId,
      UserAttributes: [
        {
          Name: 'custom:roles',
          Value: roles.toString()
        }
      ]
    })
    .promise();
};
