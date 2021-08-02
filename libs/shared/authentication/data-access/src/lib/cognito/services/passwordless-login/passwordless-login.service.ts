import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import {
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession
} from 'amazon-cognito-identity-js';
import { Auth, Cache } from 'aws-amplify/lib-esm';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';

const intToHex = (nr: number): string => nr.toString(16).padStart(2, '0');

@Injectable({
  providedIn: 'root'
})
export class PasswordlessLoginService {
  private cognitoUser?: CognitoUser;
  // Get access to window object in the Angular way
  private readonly _window: O.Option<Window>;

  constructor(@Inject(DOCUMENT) private readonly _document: Document) {
    this._window = O.fromNullable(this._document?.defaultView);
  }

  async signIn(email: string): Promise<void> {
    return Auth.signIn(email).then(user => {
      this.cognitoUser = user;
      Cache.removeItem('cognitoUser');
      Cache.setItem('cognitoUser', user);
    });
  }

  async signOut(): Promise<void> {
    await Auth.signOut();
  }

  async answerCustomChallenge(answer: string): Promise<boolean> {
    if (!this.cognitoUser) {
      this.cognitoUser = Cache.getItem('cognitoUser');
      this.getUserFromCache();
    }
    this.cognitoUser = await Auth.sendCustomChallengeAnswer(
      this.cognitoUser,
      answer
    );

    return this.isAuthenticated();
  }

  async signUp(email: string): Promise<void> {
    const params = {
      username: email,
      password: O.getOrElse(() => '')(this.getRandomString(30))
    };

    await Auth.signUp(params);
  }

  async isAuthenticated(): Promise<boolean> {
    return Auth.currentSession()
      .then(() => true)
      .catch(() => false);
  }

  async getSession(): Promise<CognitoUserSession> {
    return Auth.currentSession();
  }

  async getUserDetails(): Promise<CognitoUserAttribute[]> {
    if (!this.cognitoUser) {
      this.cognitoUser = await Auth.currentAuthenticatedUser();
    }

    return Auth.userAttributes(this.cognitoUser);
  }

  private getRandomString(bytes: number): O.Option<string> {
    return pipe(
      this._window,
      O.map(window => {
        const randomValues = new Uint8Array(bytes);
        window.crypto.getRandomValues(randomValues);
        return Array.from(randomValues).map(intToHex).join('');
      })
    );
  }

  private getUserFromCache(): void {
    const user = Cache.getItem('cognitoUser');

    const userPoolData = {
      UserPoolId: user.pool.userPoolId,
      ClientId: user.pool.clientId
    };
    const userPool = new CognitoUserPool(userPoolData);
    const userData = {
      Username: user.username,
      Pool: userPool
    };

    this.cognitoUser = new CognitoUser(userData);
  }
}
