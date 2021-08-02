import { LocalizationSelectors } from '@gtrack/shared/localization/data-access';
import { NGXLogger } from 'ngx-logger';
import { handler } from 'rx-handler';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  Input,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import * as fp from 'lodash/fp';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of, from } from 'rxjs';
import { AccountComponentModule } from '../account/account.component';
import { shareReplay, switchMap, tap, map, filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  AuthenticationSelectors,
  AuthenticationActions,
  SharedAuthenticationDataAccessModule,
} from '@gtrack/shared/authentication/data-access';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { CommonPreferencesModule } from '../preferences-common/preferences-common.component';
import { GtrackInfoModule } from '@bit/garlictech.angular.gtrack.gtrack-info';

type UserData = {
  email?: string;
  picture?: string;
};

@UntilDestroy()
@Component({
  selector: 'gtrack-common-settings',
  styleUrls: ['./common-settings.component.scss'],
  templateUrl: './common-settings.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommonSettingsComponent {
  @Input() loginMethod: () => Observable<boolean>;

  isLoggedIn$: Observable<boolean>;
   userData$: Observable<UserData>;
   termsAndCondSlug$: Observable<string>;
  privacyPolicySlug$: Observable<string>;

  onLogin = handler();
  onLogout = handler();
  onPdfDownload = handler();

  constructor(
    private readonly log: NGXLogger,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>
  ) {
    this.isLoggedIn$ = this.store.select(AuthenticationSelectors.loggedIn);
  /*   this.userData$ = this.store.select(AuthenticationSelectors.selectUser).pipe(
      filter(x => fp.isObject(x)),
      map(({ email, picture }) => ({ email, picture })),
      shareReplay(1)
    ); */

    from(this.onLogin)
      .pipe(
        untilDestroyed(this),
        switchMap(() => this.loginMethod?.() ?? of(true))
      )
      .subscribe();

    from(this.onLogout)
      .pipe(
        untilDestroyed(this),
        tap(() => this.store.dispatch(new AuthenticationActions.LogoutStart()))
      )
      .subscribe();

    this.termsAndCondSlug$ = this.store
      .select(LocalizationSelectors.currentLanguage)
      .pipe(map(language => `/assets/docs/${language}/termsAndCond.pdf`));

    this.privacyPolicySlug$ = this.store
      .select(LocalizationSelectors.currentLanguage)
      .pipe(map(language => `/assets/docs/${language}/privacyPolicy.pdf`));
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    IonicModule,
    TranslateModule,
    CommonModule,
    SharedLocalizationDataAccessModule,
    AccountComponentModule,
    CommonPreferencesModule,
    GtrackInfoModule,
    SharedAuthenticationDataAccessModule,
  ],
  declarations: [CommonSettingsComponent],
  exports: [CommonSettingsComponent],
})
export class CommonSettingsComponentModule {}
