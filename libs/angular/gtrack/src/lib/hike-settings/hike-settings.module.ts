import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsSharedGenericUiDataAccessModule } from '../customer/settings-pipes.module';
import { SpeedEditorComponent } from './editor/speed-editor.component';
import { StartDateTimeEditorComponent } from './editor/start-date-time-editor.component';
import { HikeSettingsBaseComponent } from './hike-settings-base.component';
import { HikeCommonSettingsComponent } from './hike-settings.component';
import { HikeCustomerService } from './hike-settings.service';

const COMPONENTS = [
  HikeCommonSettingsComponent,
  HikeSettingsBaseComponent,
  StartDateTimeEditorComponent,
  SpeedEditorComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    UtilsModule,
    SettingsSharedGenericUiDataAccessModule

  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [StartDateTimeEditorComponent, SpeedEditorComponent],
  providers: [HikeCustomerService],
})
export class HikeSettingsModule {}
