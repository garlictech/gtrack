import { Component, NgModule, Input } from '@angular/core';

import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'gtrack-hike-details-titled-section',
  templateUrl: './titled-section.component.html',
  styleUrls: ['./titled-section.component.scss'],
})
export class TitledSectionComponent {
  @Input() titleLabel: string;
  @Input() isContentReady: boolean;
}

@NgModule({
  imports: [CommonModule, TranslateModule, IonicModule],
  exports: [TitledSectionComponent],
  declarations: [TitledSectionComponent],
})
export class TitledSectionComponentModule {}
