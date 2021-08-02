import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons';
import {
  faTachometerAlt,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { HikeSettingsBaseComponent } from './hike-settings-base.component';
import { HikeCustomerService } from './hike-settings.service';

@Component({
  selector: 'gtrack-hike-settings',
  templateUrl: './hike-settings.component.html',
  styleUrls: ['./hike-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeCommonSettingsComponent extends HikeSettingsBaseComponent {
  calendarIcon: IconDefinition;
  speedIcon: IconDefinition;

  constructor(store: Store, hikeCustomerService: HikeCustomerService) {
    super(store, hikeCustomerService);
    this.calendarIcon = faCalendarAlt;
    this.speedIcon = faTachometerAlt;
  }
}
