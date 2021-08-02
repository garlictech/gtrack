import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CommonSettingsComponentModule } from '@bit/garlictech.angular.gtrack.customer';
import { CommonHeaderModule } from '@bit/garlictech.angular.gtrack.gtrack-header';

@Component({
  selector: 'gtrack-common-settings-website-page',
  styleUrls: ['./settings-page.component.scss'],
  templateUrl: './settings-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsWebsitePageComponent {}

const routes: Routes = [
  {
    path: '',
    component: SettingsWebsitePageComponent,
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
  declarations: [SettingsWebsitePageComponent],
})
export class SettingsPageWebsiteModule {}
