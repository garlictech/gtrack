// eslint:disable:no-property-initializers max-classes-per-file
import { Action } from '@ngrx/store';

export enum MessageActionTypes {
  LANGUAGE_CHANGED = '[Localize] Language changed',
  DESCRIPTION_LANGUAGE_LIST_CHANGED = '[Localize] Description language list changed',
}

export class LanguageChanged implements Action {
  readonly type = MessageActionTypes.LANGUAGE_CHANGED;

  constructor(public language: string) {}
}

export class DescriptionLanguageListChanged implements Action {
  readonly type = MessageActionTypes.DESCRIPTION_LANGUAGE_LIST_CHANGED;

  constructor(public languages: string[]) {}
}

export type AllActions = LanguageChanged | DescriptionLanguageListChanged;
