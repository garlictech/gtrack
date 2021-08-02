import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsModule } from '../../../settings-ionic/settings.module';
import { SettingsPageComponent } from './settings-page.component';

@NgModule({
  imports: [CommonModule, IonicModule, SettingsModule, TranslateModule],
  declarations: [SettingsPageComponent],
  exports: [SettingsPageComponent],
})
export class SettingsPageModule {}

export { SettingsPageComponent };
