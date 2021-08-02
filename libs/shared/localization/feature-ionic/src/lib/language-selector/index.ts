import { Component, OnInit } from '@angular/core';
import {
  LanguageDesc,
  LanguageService,
  LocalizationSelectors,
} from '@gtrack/shared/localization/data-access';
import { Store } from '@ngrx/store';
import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { faLanguage } from '@fortawesome/pro-light-svg-icons';

type LanguageSelectorOption = {
  label: string;
  value: LanguageDesc;
};

@Component({
  selector: 'gtrack-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  allLanguages!: LanguageSelectorOption[];
  selectedLanguage?: LanguageSelectorOption;
  supportedLanguages: LanguageDesc[];
  currentLanguage$: Observable<string>;
  icon = faLanguage;

  constructor(
    protected _languageService: LanguageService,
    protected readonly _store: Store
  ) {
    this.supportedLanguages = this._languageService.getSupportedLanguages();
    this.currentLanguage$ = this._store
      .select(LocalizationSelectors.currentLanguage)
      .pipe(filter(fp.negate(fp.isUndefined)));
  }

  setLanguage(event: any): void {
    this._languageService.setLanguage(event.detail.value);
  }

  ngOnInit(): void {
    this.allLanguages = this.supportedLanguages.map(lang => ({
      label: lang.name,
      value: lang,
    }));
  }
}
