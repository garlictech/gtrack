import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export enum EAuthRoles {
  user = 'user',
  admin = 'admin',
}

export interface User {
  id: string;
  customerId: string;
  email?: string;
  roles: EAuthRoles[];
  picture?: string;
}

export interface Auth {
  token?: string;
  user?: User;
}

export interface RedirectableAfterSuccess {
  redirectAfterSuccess?: string | string[];
}

export interface AuthRedirects {
  redirectAfterLogout?: string | string[];
  redirectAfterAuthSuccess?: string | string[];
  redirectIfUnauth?: string | string[];
}

export interface AuthConfig {
  apiRoot: string;
}

export const AUTH_CONFIG = new InjectionToken<AuthConfig>(
  'Authentication config'
);

export interface AuthenticationConfig {
  apiRoot: string;
  apiVersion: string;
}

export interface AuthCredentials {
  accessKeyId: string;
  sessionToken: string;
  secretAccessKey: string;
  identityId: string;
  authenticated: boolean;
}

export interface AuthenticationCredentials {
  token: string;
}

export interface AuthenticationPlatform {
  getAuth(): Observable<Auth>;
  onSignOn(callback: () => void): void;
  onSignOut(callback: () => void): void;
  logout(): Observable<boolean>;
  googleLogin(): Observable<boolean>;
  facebookLogin(): Observable<boolean>;
  appleLogin(): Observable<boolean>;
  startMagicLinkLogin(email: string): Observable<void>;
  finishMagicLinkLogin(token: string): Observable<boolean>;
  refreshSession(): Observable<boolean>;
  isAuthenticated(): Observable<boolean>;
  hasGoogleLogin(): Observable<boolean>;
  hasFacebookLogin(): Observable<boolean>;
}

export const AUTHENTICATION_PLATFORM = new InjectionToken<
  AuthenticationPlatform
>('Authentication platform implementation');
