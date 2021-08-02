import { NGXLogger } from 'ngx-logger';
import { Inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalizeConfig, LOCALIZATION_CONFIG_TOKEN } from './interfaces';
import { LanguageDesc, Languages } from './languages';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _supportedLanguages: LanguageDesc[] = [];

  constructor(
    private readonly log: NGXLogger,
    private readonly _translate: TranslateService,
    @Inject(LOCALIZATION_CONFIG_TOKEN) private readonly _config: LocalizeConfig
  ) {
    this._init();
  }

  setLanguage(languageCode: string): void {
    this._translate.use(languageCode);
    localStorage.setItem('actualLanguage', languageCode);
  }

  getAllLanguages(): LanguageDesc[] {
    return [...Languages];
  }

  getLanguageDescOfId(languageId: string): LanguageDesc | undefined {
    return Languages.find(lang => lang.id === languageId);
  }

  getSupportedLanguages(): LanguageDesc[] {
    return this._supportedLanguages;
  }

  private _init(): void {
    this._translate.addLangs(this._config.supportedLanguages);
    this._translate.setDefaultLang(this._config.defaultLanguage);
    let actualLanguage: string | null = localStorage.getItem('actualLanguage');

    if (!actualLanguage) {
      const browserCultureLang = this._translate.getBrowserCultureLang() || '';
      const browserLang = browserCultureLang.replace(/-/, '_') || 'en_US';
      this.log.debug(`Detected browser language: ${browserLang}`);
      actualLanguage =
        this._config.supportedLanguages.indexOf(browserLang) > -1
          ? browserLang
          : this._config.defaultLanguage;
    }

    this._translate.use(actualLanguage);
    this._supportedLanguages = Languages.filter(
      lang => this._config.supportedLanguages.indexOf(lang.id) > -1
    );
    this.log.debug('Supported languages: ', this._supportedLanguages);
  }
}
