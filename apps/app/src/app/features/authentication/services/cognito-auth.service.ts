import { Injectable, Injector } from '@angular/core';

import Auth from '@aws-amplify/auth';
import { Auth as AuthData } from '@gtrack/shared/authentication/data-access';
import {
  CognitoAuthService as CognitoAuthServiceWeb,
  createAuthDataFromToken,
} from '@gtrack/shared/authentication/data-access';
import { showProgressSpinner } from '@gtrack/shared/generic-ui/data-access/store/actions';
import { Store } from '@ngrx/store';
import { CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';
import { AmplifyService } from 'aws-amplify-angular';
import { from, Observable, of } from 'rxjs';
import { delay, map, mapTo, tap } from 'rxjs/operators';

// interface CognitoAwsConfig {
//   aws_cognito_identity_pool_id: string;
//   aws_identity_pool_id: string;
//   aws_project_region: string;
//   aws_cognito_region: string;
//   aws_user_pools_id: string;
//   aws_user_pools_web_client_id: string;
//   oauth: {
//     domain: string;
//     scope: string[];
//     redirectSignIn: string;
//     redirectSignOut: string;
//     responseType: string;
//   };
//   federationTarget: string;
// }

@Injectable()
export class CognitoMobileAuthService extends CognitoAuthServiceWeb {
  constructor(
    injector: Injector,
    private _amplify: AmplifyService,
    private _store: Store
  ) {
    super(injector);
  }

  public facebookLogin(): Observable<boolean> {
    return of(this.startFacebookOauth()).pipe(mapTo(true));
  }

  private startFacebookOauth(): boolean {
    // const url =
    //   'https://' +
    //   this._config.domain +
    //   '/oauth2/authorize?response_type=code&identity_provider=Facebook&client_id=' +
    //   this._config.userPoolClientId +
    //   '&redirect_uri=' +
    //   this.getCallbackUrl() +
    //   '&scopes=email,profile,openid,aws.cognito.signin.user.admin';
    // const login_page = this.browser.create(url, '_blank', { location: 'no', toolbar: 'no', usewkwebview: 'yes' });
    // login_page.on('loadstart').subscribe(event => {
    //   if (event.url.startsWith(this.awsConfig.oauth.redirectSignIn)) {
    //     const code = event.url.split('=')[1];
    //     login_page.close();
    //     window.location.href = '/?code=' + code;
    //   }
    // });
    // login_page.on('loaderror').subscribe(event => {
    //   // window.location.href = '';
    //   login_page.close();
    //   this._store.dispatch(
    //     displayToast({
    //       summary: 'Login error!',
    //       detail: event.message,
    //       severity: EToastSeverity.Error,
    //     })
    //   );
    // });
    return true;
  }

  public getAuth(): Observable<AuthData> {
    return from(Auth.currentSession()).pipe(
      map((auth: CognitoUserSession) => auth.getIdToken()),
      map(createAuthDataFromToken)
    );
  }

  public logout(): Observable<boolean> {
    return from(Auth.currentUserPoolUser()).pipe(
      map((user: CognitoUser) => {
        this._amplify.setAuthState({
          state: 'signedOut',
          user,
        });
        user.signOut();
        this._amplify.cache().clear();
        return true;
      }),
      tap(() =>
        this._store.dispatch(
          showProgressSpinner({ spinnerId: 'authentication' })
        )
      ), // ---Show spinner while waiting
      delay(1000), // ---Should wait a little to Cognito clear all local data and made the logout
      tap(() => (window.location.href = '/')), // ---Redirect back to the app to refresh it's data
      mapTo(true)
    );
  }

  protected getCallbackUrl(): string {
    return 'http://localhost:8083';
  }
}
