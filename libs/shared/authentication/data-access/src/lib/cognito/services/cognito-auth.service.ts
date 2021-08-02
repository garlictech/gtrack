import { DOCUMENT } from '@angular/common';
import { Injectable, Injector } from '@angular/core';
import Auth, {
  CognitoHostedUIIdentityProvider,
  CognitoUser,
} from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { CognitoUserSession } from 'amazon-cognito-identity-js';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap } from 'rxjs/operators';
import { AuthenticationPlatform } from '../../interfaces';
import { COGNITO_CONFIG, CognitoConfig } from '../interfaces';
import { PasswordlessLoginService } from './passwordless-login/passwordless-login.service';
import { Auth as SystemAuth } from '@gtrack/shared/authentication/data-access';

interface CognitoAwsConfig {
  aws_project_region: string;
  aws_cognito_region: string;
  aws_user_pools_id: string;
  aws_user_pools_web_client_id: string;
  oauth: {
    domain: string;
    scope: string[];
    redirectSignIn: string;
    redirectSignOut: string;
    responseType: string;
  };
  federationTarget: string;
}

@Injectable()
export class CognitoAuthService implements AuthenticationPlatform {
  protected onSignInCallback?: () => void;
  protected onSignOutCallback?: () => void;
  protected readonly passwordlessLoginService: PasswordlessLoginService;

  protected readonly _config: CognitoConfig;
  protected readonly _document: Document;

  constructor(injector: Injector) {
    this.passwordlessLoginService = injector.get(PasswordlessLoginService);
    this._config = injector.get(COGNITO_CONFIG);
    this._document = injector.get(DOCUMENT);
    this.configure();
    Hub.listen('auth', data => {
      const { payload } = data;
      this.onAuthEvent(payload);
    });
  }

  public googleLogin(): Observable<boolean> {
    return from(
      Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Google,
      })
    ).pipe(mapTo(true));
  }

  public facebookLogin(): Observable<boolean> {
    return from(
      Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Facebook,
      })
    ).pipe(mapTo(true));
  }

  public appleLogin(): Observable<boolean> {
    return from(
      Auth.federatedSignIn({
        provider: CognitoHostedUIIdentityProvider.Apple,
      })
    ).pipe(mapTo(true));
  }

  public passwordLogin(
    username: string,
    password: string
  ): Observable<boolean> {
    return from(Auth.signIn(username, password)).pipe(mapTo(true));
  }

  public refreshSession(): Observable<boolean> {
    return from(Auth.currentSession()).pipe(mapTo(true));
  }

  public getAuth(): Observable<SystemAuth> {
    return from(Auth.currentAuthenticatedUser()).pipe(
      map((auth: CognitoUser) => {
        const token = auth?.getSignInUserSession()?.getIdToken();
        const decoded = token?.decodePayload();

        return {
          token: token?.getJwtToken(),
          user: {
            id: decoded?.sub,
            customerId: decoded?.sub,
            email: decoded?.email,
            roles: decoded?.roles.split(','),
          },
        };
      })
    );
  }

  public isAuthenticated(): Observable<boolean> {
    return from(Auth.currentAuthenticatedUser()).pipe(
      mapTo(true),
      catchError(() => of(false))
    );
  }

  public getUserProfile(): Observable<unknown> {
    return from(Auth.currentUserInfo());
  }

  public onSignOn(callback: () => void): void {
    this.onSignInCallback = callback;
  }

  public onSignOut(callback: () => void): void {
    this.onSignOutCallback = callback;
  }

  public logout(): Observable<boolean> {
    return from(Auth.signOut()).pipe(mapTo(true));
  }

  public startMagicLinkLogin(email: string): Observable<void> {
    return from(this.passwordlessLoginService.signUp(email)).pipe(
      switchMap(() =>
        from(this.passwordlessLoginService.signIn(email) as Promise<void>)
      )
    );
  }

  public finishMagicLinkLogin(token: string): Observable<boolean> {
    return from(
      this.passwordlessLoginService.answerCustomChallenge(token)
    ).pipe(
      filter(authenticated => !!authenticated),
      switchMap(() =>
        from(
          this.passwordlessLoginService.getSession() as Promise<
            CognitoUserSession
          >
        )
      ),
      mapTo(true)
    );
  }

  private onAuthEvent(payload: {
    event: string;
    data?: unknown;
    message?: string;
  }): void {
    if (payload.event === 'signIn') {
      this.onSignInCallback?.();
    } else if (payload.event === 'signOut') {
      this.onSignOutCallback?.();
    }
  }

  private configure(): void {
    const awsConfig: CognitoAwsConfig = {
      aws_project_region: this._config.region,
      aws_cognito_region: this._config.region,
      aws_user_pools_id: this._config.userPoolId,
      aws_user_pools_web_client_id: this._config.userPoolClientId,
      oauth: {
        domain: this._config.domain,
        scope: this._config.scope,
        redirectSignIn: this.getCallbackUrl(),
        redirectSignOut: this.getCallbackUrl(),
        responseType: 'code',
      },
      federationTarget: 'COGNITO_USER_AND_IDENTITY_POOLS',
    };

    Auth.configure(awsConfig);
  }

  public hasGoogleLogin(): Observable<boolean> {
    return of(true);
  }

  public hasFacebookLogin(): Observable<boolean> {
    return of(true);
  }

  protected getCallbackUrl(): string {
    return this._document.location.origin;
  }
}
