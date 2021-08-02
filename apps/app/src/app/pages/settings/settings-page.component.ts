import { NGXLogger } from 'ngx-logger';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CommonSettingsComponentModule } from '@bit/garlictech.angular.gtrack.customer';
import { CommonHeaderModule } from '@bit/garlictech.angular.gtrack.gtrack-header';
import { Observable } from 'rxjs';
import {
  AuthorizationService,
  AccessLevel,
} from '@bit/garlictech.angular.gtrack.authorization';
import { EAuthRoles } from '@gtrack/shared/authentication/data-access';

@Component({
  selector: 'gtrack-common-settings-page',
  template: `
    <gtrack-common-header></gtrack-common-header>

    <ion-content fullscreen scroll-y="false" scroll-x="false">
      <gtrack-common-settings
        [loginMethod]="loginMethod"
      ></gtrack-common-settings
    ></ion-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  loginMethod: () => Observable<boolean>;

  constructor(
    private readonly log: NGXLogger,
    private readonly authorizationService: AuthorizationService
  ) {
    this.loginMethod = () =>
      this.authorizationService.authorizedCall$(
        () => {
          /* EMPTY */
        },
        AccessLevel.AUTHENTICATED,
        EAuthRoles.user
      );
  }
}

const routes: Routes = [
  {
    path: '',
    component: SettingsPageComponent,
  },
];

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule,
    CommonModule,
    CommonHeaderModule,
    CommonSettingsComponentModule,
  ],
  declarations: [SettingsPageComponent],
})
export class SettingsPageModule {}
