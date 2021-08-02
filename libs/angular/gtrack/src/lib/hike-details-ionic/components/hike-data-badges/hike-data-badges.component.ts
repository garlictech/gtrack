import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils';
import { DataBadgeComponentModule } from '@bit/garlictech.angular.gtrack.data-visualization-ionic';
import { DifficultyComponentModule } from '@bit/garlictech.angular.gtrack.difficulty-ionic';
import { SettingsSharedGenericUiDataAccessModule } from '@bit/garlictech.angular.gtrack.customer/settings-pipes.module';

@Component({
  selector: 'gtrack-hike-data-badges',
  templateUrl: './hike-data-badges.component.html',
  styleUrls: ['./hike-data-badges.component.scss'],
})
export class HikeDataBadgesComponent {
  @Input() hike!: CalculatedHike;
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  imports: [
    DataBadgeComponentModule,
    DifficultyComponentModule,
    CommonModule,
    SettingsSharedGenericUiDataAccessModule,
    UtilsModule,
  ],
  exports: [HikeDataBadgesComponent],
  declarations: [HikeDataBadgesComponent],
  providers: [],
})
export class HikeDataBadgesComponentModule {}
