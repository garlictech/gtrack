import { Auth } from '../interfaces';

export interface AuthenticationState {
  auth?: Auth;
  loggingIn: boolean;
  failed?: string;
  emailSent: boolean;
  selectedRole: string;
  loginRefused: boolean;
}

export const featureName = 'shared.authentication';
