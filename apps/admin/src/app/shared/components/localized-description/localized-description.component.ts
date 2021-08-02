import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import {
  MarkdownField,
  SharedFormsFeatureModule,
  TextboxField,
} from '@gtrack/shared/forms/feature';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  NgModule,
  OnInit,
} from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  AdminLanguageService,
  DESCRIPTION_LANGUAGES,
  LngObject,
} from '../../services';
import {
  NbAccordionModule,
  NbButtonModule,
  NbSelectModule,
} from '@nebular/theme';
import {
  TextualDescription,
  TextualDescriptionType,
} from '@gtrack/shared/localization/utils';

@Component({
  selector: 'gtrack-localized-description',
  templateUrl: './ui.html',
  styleUrls: ['./style.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocalizedDescriptionComponent implements AfterViewInit, OnInit {
  @Input() description$: Observable<TextualDescription[]>;
  @Input() submitFv: (data: TextualDescription) => void;
  @Input() deleteFv: (langKey: string) => void;
  @Input() type?: string;

  languageKeys$: Observable<string[]>;
  selectableLanguages$: Observable<{ label: string; value: string }[]>;
  selectedLanguage: { value: string };
  languageFormDescriptors$: Observable<string>;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.languageKeys$ = this.description$.pipe(
      map(fp.flow(fp.map('languageKey'), fp.sortBy))
    );

    this.languageFormDescriptors$ = this.description$.pipe(
      map(
        fp.flow(
          fp.sortBy(['languageKey']),
          fp.map((description: TextualDescription) =>
            this._getLanguageFormDescriptor(description)
          )
        )
      )
    );
  }

  ngAfterViewInit(): void {
    this.selectableLanguages$ = this.languageKeys$.pipe(
      map(usedLanguageKeys =>
        fp.flow(
          fp.reject((descLangItem: LngObject) =>
            fp.includes(descLangItem.locale, usedLanguageKeys)
          ),
          fp.map(descLangItem => ({
            label: descLangItem.name,
            value: descLangItem.locale,
          }))
        )(DESCRIPTION_LANGUAGES)
      )
    );

    this._changeDetectorRef.detectChanges();
  }

  addTranslation(): void {
    if (this.selectedLanguage) {
      this.submitFv({
        languageKey: this.selectedLanguage.value,
        title: `A new ${this.type}`,
        type: TextualDescriptionType.markdown,
      });

      //this.selectedLanguage = undefined;
    }
  }

  deleteTranslation(lang: string): void {
    this.deleteFv(lang);
  }

  getLangName(key: string): string {
    return AdminLanguageService.localeToName(key);
  }

  trackByFn(index: number): number {
    return index;
  }

  private _getLanguageFormDescriptor(description: TextualDescription): unknown {
    return {
      languageKey: description.languageKey,
      submit: {
        translatableLabel: 'form.submit',
        classList: ['btn', 'btn-sm', 'btn-fill', 'btn-success', 'my-2'],
        submitFv: (formGroup: FormGroup) =>
          this.submitFv({
            languageKey: description.languageKey,
            type: TextualDescriptionType.markdown,
            title: formGroup.value.title,
            ...fp.pickBy(fp.identity, formGroup.value),
          }),
      },
      fields: {
        title: new TextboxField({
          label: 'form.title',
          required: true,
          submitOnChange: true,
          defaultValue: description.title,
        }),
        summary: new MarkdownField({
          label: 'form.summary',
          required: false,
          rows: 2,
          submitOnChange: true,
          defaultValue: description.summary,
        }),
        fullDescription: new MarkdownField({
          label: 'form.description',
          required: false,
          submitOnChange: true,
          defaultValue: description.fullDescription,
        }),
      },
    };
  }
}

@NgModule({
  imports: [
    CommonModule,
    SharedFormsFeatureModule,
    SharedLocalizationFeatureIonicModule,
    FormsModule,
    NbButtonModule,
    NbSelectModule,
    NbAccordionModule,
  ],
  exports: [LocalizedDescriptionComponent],
  declarations: [LocalizedDescriptionComponent],
})
export class LocalizedDescriptionModule {}
