import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedLocalizationDataAccessModule } from '@gtrack/shared/localization/data-access';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'gtrack-info',
  templateUrl: './gtrack-info.component.html',
  styleUrls: ['./gtrack-info.component.scss'],
})
export class GtrackInfoComponent {
  @Input() privacyPolicySlug: string | null;
  @Input() termsAndCondSlug: string | null;
}

@NgModule({
  imports: [
    TranslateModule,
    RouterModule,
    CommonModule,
    IonicModule,
    SharedLocalizationDataAccessModule,
  ],
  declarations: [GtrackInfoComponent],
  exports: [GtrackInfoComponent],
  providers: [],
})
export class GtrackInfoModule {}
