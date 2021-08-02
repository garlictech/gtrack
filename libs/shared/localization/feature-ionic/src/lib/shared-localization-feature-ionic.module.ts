import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalizeDescriptionPipe } from './localize-description.pipe';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { LanguageSelectorComponent } from './language-selector';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    TranslateModule,
    IonicModule,
    CommonModule,
    SharedLocalizationDataAccessModule,
  ],
  declarations: [LocalizeDescriptionPipe, LanguageSelectorComponent],
  exports: [LocalizeDescriptionPipe, LanguageSelectorComponent],
})
export class SharedLocalizationFeatureIonicModule {}
