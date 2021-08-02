import * as LocalizationSelectors  from '../lib/+state/selectors';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  MultiLanguageTextFp,
  TextualDescription,
  TextualDescriptionType,
} from '@gtrack/shared/localization/utils';

@Injectable({ providedIn: 'root' })
export class DescriptionLanguageListService {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private store: Store<any>,
    private readonly translateService: TranslateService
  ) {}

  getLocalizedDescription(
    descriptions: TextualDescription[]
  ): Observable<TextualDescription> {
    if (!descriptions) {
      return of({
        languageKey: 'en_US',
        title: '',
        type: TextualDescriptionType.html,
      });
    }

    const selectByLanguageKey = () =>
      this.store
        .select(LocalizationSelectors.currentLanguage)
        .pipe(
          map(currentLanguage =>
            MultiLanguageTextFp.selectTextByLanguage(currentLanguage)(
              descriptions
            )
          )
        );

    const translateFields = (
      desc: TextualDescription
    ): Observable<TextualDescription> =>
      this.translateService.get('foobar').pipe(
        map(() => ({
          ...desc,
          ...fp.flow(
            fp.omit(['languageKey', 'type']),
            fp.mapValues((x: string) => this.translateService.instant(x))
          )(desc),
        }))
      );

    return descriptions[0].languageKey ===
      MultiLanguageTextFp.translatableTagLangKey()
      ? translateFields(descriptions[0])
      : selectByLanguageKey();
  }
}
