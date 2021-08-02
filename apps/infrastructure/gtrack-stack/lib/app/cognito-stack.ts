import { CfnOutput } from '@aws-cdk/core';
import * as cognito from '@aws-cdk/aws-cognito';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { Stack } from '@serverless-stack/resources';
import { commonLambdaProps } from './lambda-common';

export class CognitoStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const app = this.node.root as App;

    const userPool = new cognito.UserPool(this, 'UserPool', {
      selfSignUpEnabled: true, // Allow users to sign up
      autoVerify: { email: true }, // Verify email addresses by sending a verification code
      signInAliases: { email: true }, // Set email as an alias
      lambdaTriggers: {
        preSignUp: new lambda.Function(this, 'preSignUp', {
          ...commonLambdaProps,
          handler: 'lib/cognito/passwordless-pre-sign-up/index.handler',
          code: lambda.Code.fromAsset(
            path.join(__dirname, '../../.serverless/pre-sign-up.zip')
          )
        }),
        preAuthentication: new lambda.Function(this, 'preAuthentication', {
          ...commonLambdaProps,
          handler: 'lib/cognito/pre-authentication/index.handler',
          code: lambda.Code.fromAsset(
            path.join(__dirname, '../../.serverless/pre-authentication.zip')
          )
        }),
        verifyAuthChallengeResponse: new lambda.Function(
          this,
          'verifyAuthChallengeResponse',
          {
            ...commonLambdaProps,
            handler: 'lib/cognito/verify-auth-challenge-response/index.handler',
            code: lambda.Code.fromAsset(
              path.join(
                __dirname,
                '../../.serverless/verify-auth-challenge-response.zip'
              )
            )
          }
        ),
        preTokenGeneration: new lambda.Function(this, 'preTokenGeneration', {
          ...commonLambdaProps,
          handler: 'lib/cognito/pre-token-generation/index.handler',
          code: lambda.Code.fromAsset(
            path.join(__dirname, '../../.serverless/pre-token-generation.zip')
          )
        }),
        defineAuthChallenge: new lambda.Function(this, 'defineAuthChallenge', {
          ...commonLambdaProps,
          handler: 'lib/cognito/define-auth-challenge/index.handler',
          code: lambda.Code.fromAsset(
            path.join(__dirname, '../../.serverless/define-auth-challenge.zip')
          )
        }),
        createAuthChallenge: new lambda.Function(this, 'createAuthChallenge', {
          ...commonLambdaProps,
          handler: 'lib/cognito/create-auth-challenge/index.handler',
          code: lambda.Code.fromAsset(
            path.join(__dirname, '../../.serverless/create-auth-challenge.zip')
          ),
          environment: {
            USERPOOL_MOBILE_CLIENT_ID: 'CREATE_MOBILE_USER_POOL_CLIENT',
            DEEP_LINK: 'gtrack://app',
            SES_FROM_ADDRESS: 'noreply@gtracksport.com'
          }
        })
      }
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      generateSecret: false // Don't need to generate secret for web app running on browsers
    });

    const identityPool = new cognito.CfnIdentityPool(this, 'IdentityPool', {
      allowUnauthenticatedIdentities: false, // Don't allow unathenticated users
      cognitoIdentityProviders: [
        {
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName
        }
      ]
    });

    // Export values
    const userPoolId = 'UserPoolId';
    new CfnOutput(this, userPoolId, {
      value: userPool.userPoolId,
      exportName: app.logicalPrefixedName(userPoolId)
    });

    const userPoolClientId = 'UserPoolClientId';
    new CfnOutput(this, userPoolClientId, {
      value: userPoolClient.userPoolClientId,
      exportName: app.logicalPrefixedName(userPoolClientId)
    });

    const identityPoolId = 'IdentityPoolId';
    new CfnOutput(this, identityPoolId, {
      value: identityPool.ref,
      exportName: app.logicalPrefixedName(identityPoolId)
    });
  }
}
