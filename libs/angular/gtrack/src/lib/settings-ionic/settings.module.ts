import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { SharedFormsFeatureModule } from '@gtrack/shared/forms/feature';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  DeletionButtonComponent,
  ProfilePhotoComponent,
  UserProfileFormComponent,
} from './components';

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    SharedFormsFeatureModule,
    IonicModule,
    SharedLocalizationDataAccessModule,
    RouterModule,
    TranslateModule,
    UtilsModule,
  ],
  declarations: [
    UserProfileFormComponent,
    DeletionButtonComponent,
    ProfilePhotoComponent,
  ],
  exports: [
    UserProfileFormComponent,
    ProfilePhotoComponent,
    DeletionButtonComponent,
  ],
})
export class SettingsModule {}
