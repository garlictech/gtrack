import { Injectable } from '@angular/core';
import { map as _map } from 'lodash';

export interface LngObject {
  locale: string;
  short: string;
  name: string;
}

export const DESCRIPTION_LANGUAGES: LngObject[] = [
  { locale: 'en_US', short: 'en', name: 'English' },
  { locale: 'hu_HU', short: 'hu', name: 'Hungarian' },
  // { locale: 'de_DE', short: 'de', name: 'German' },
  // { locale: 'fr_FR', short: 'fr', name: 'French' }
];

export const DESCRIPTION_LANGUAGES_SHORT = _map(DESCRIPTION_LANGUAGES, 'short');

@Injectable()
export class AdminLanguageService {
  static get descriptionLanguages(): Record<string, unknown> {
    return {
      en_US: 'English',
      hu_HU: 'Hungarian',
      // de_DE: 'German',
      // fr_FR: 'French'
    };
  }

  static shortToLocale(lng: string): string {
    const _lang = DESCRIPTION_LANGUAGES.find(lang => lang.short === lng);

    return _lang ? _lang.locale : lng;
  }

  static localeToName(locale: string): string {
    const _lang = DESCRIPTION_LANGUAGES.find(lang => lang.locale === locale);

    return _lang ? _lang.name : locale;
  }

  static pascalize(text: string): string {
    const words = text.split('_');
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

    return words.join(' ');
  }
}
