import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedFormsFeatureModule } from '@gtrack/shared/forms/feature';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';


import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    /*     EmailSentComponent,
        PasswordlessSuccessComponent,*/
/*     AuthStartComponent,
 */  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedFormsFeatureModule,
    TranslateModule,
    SharedLocalizationDataAccessModule,
    FontAwesomeModule,
    IonicModule,
  ],
/*   exports: [AuthStartComponent],
 */})
export class AuthenticationModule { }
