import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { Store, StoreModule } from '@ngrx/store';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './language.service';
import { reducer } from './+state/reducer';
import { featureName } from './+state/state';
import * as Actions from './+state/actions';
import { HttpClientModule } from '@angular/common/http';

export const _init = () => (): void => {
  /* EMPTY */
};

@NgModule({
  imports: [HttpClientModule, StoreModule.forFeature(featureName, reducer)],
})
export class SharedLocalizationDataAccessModule {
  static forRoot(): ModuleWithProviders<SharedLocalizationDataAccessModule> {
    return {
      ngModule: SharedLocalizationDataAccessModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: _init,
          deps: [LanguageService],
          multi: true,
        },
      ],
    };
  }

  constructor(
    private readonly _translateService: TranslateService,
    private readonly _store: Store
  ) {
    this._translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this._store.dispatch(new Actions.LanguageChanged(event.lang));
    });
  }
}
