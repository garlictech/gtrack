import { InjectionToken } from '@angular/core';

export interface LocalizeConfig {
  defaultLanguage: string;
  supportedLanguages: string[];
}

export interface LanguageDesc {
  id: string;
  title: string;
  name: string;
  flagImg: string;
  flagTitle: string;
}

export const LOCALIZATION_CONFIG_TOKEN = new InjectionToken<LocalizeConfig>(
  'LocalizationConfig'
);
