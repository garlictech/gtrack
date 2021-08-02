import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export enum NotificaitonSeverity {
  Success = 'success',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export interface Notification {
  text: string | null;
  type: string | null;
  severity: NotificaitonSeverity;
}

export enum EToastSeverity {
  Success = 'success',
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}

export enum EInputType {
  'number',
  'text',
  'email',
  'password',
  'tel',
  'range',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'file',
  'url',
}

/**
 * The toast descriptor.
 *
 * @export
 */
export interface Toast {
  /**
   * Toast severity. Implement a default value! It determines the toast color.
   *
   */
  severity?: EToastSeverity;
  /**
   * Toast summary as translateable label.
   *
   */
  summary: string;
  /**
   * A longer description as translateable label.
   *
   */
  detail?: string;
}

export interface GenericUiPlatformService {
  /**
   * Display a loader dialog ("spinner") with backdrop. Emits true when the spinner is displayed.
   * You can give an optional, translated text label that is displayed below the spinner.
   */
  displayLoader(loaderId: string, textLabel?: string): Observable<boolean>;

  /** Dismiss the loader dialog ("spinner"),  Emits true when the spinner is removed. */
  dismissLoader(loaderId: string): Observable<boolean>;

  /** Display a toast notification */
  displayToast(toast: Toast): void;
}

export const GENERIC_UI_PLATFORM_SERVICE = new InjectionToken<
  GenericUiPlatformService
>('Generic UI platform service');
