import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsModule } from '../../../settings-ionic/settings.module';
import { ProfilePageComponent } from './profile-page.component';

@NgModule({
  imports: [CommonModule, SettingsModule],
  declarations: [ProfilePageComponent],
  exports: [ProfilePageComponent],
})
export class ProfilePageModule {}

export { ProfilePageComponent };
