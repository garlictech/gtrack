import { Component, Input, OnInit } from '@angular/core';
import { HikeSettings } from '@bit/garlictech.angular.gtrack.customer';

import {
  selectHikeSettingsOfOrDefault,
  selectSpeedHikeSettingsOf,
  selectStartDateHikeSettingsOf,
} from '@bit/garlictech.angular.gtrack.customer/store/selectors';
import { Store } from '@ngrx/store';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { HikeCustomerService } from './hike-settings.service';

@UntilDestroy()
@Component({
  selector: 'gtrack-hike-settings-base',
  template: '',
})
export class HikeSettingsBaseComponent implements OnInit {
  @Input() hikeId: string;
  startDate$: Observable<Date>;
  speed$: Observable<number>;

  constructor(
    protected _store: Store,
    protected hikeCustomerService: HikeCustomerService
  ) {}

  ngOnInit(): void {
    this.startDate$ = this._store.select(
      selectStartDateHikeSettingsOf,
      this.hikeId
    );
    this.speed$ = this._store.select(selectSpeedHikeSettingsOf, this.hikeId);
  }

  onStartDateClick(): void {
    this.getHikeSettingsFromStore()
      .pipe(
        take(1),
        switchMap(hikeSettings =>
          this.hikeCustomerService
            .getNewStartDateFromPopover(hikeSettings.startTime)
            .pipe(
              map(newStartDate => ({
                ...hikeSettings,
                startDate: newStartDate,
              }))
            )
        ),
        untilDestroyed(this)
      )
      .subscribe(newSettings => this.saveHikeSettings(newSettings));
  }

  onSpeedClick(): void {
    this.getHikeSettingsFromStore()
      .pipe(
        take(1),
        switchMap(hikeSettings =>
          this.hikeCustomerService
            .getNewSpeedFromPopover(hikeSettings.speed)
            .pipe(map(newSpeed => ({ ...hikeSettings, speed: newSpeed })))
        ),
        untilDestroyed(this)
      )
      .subscribe(newSettings => this.saveHikeSettings(newSettings));
  }

  getHikeSettingsFromStore(): Observable<HikeSettings> {
    return this._store.select(selectHikeSettingsOfOrDefault, this.hikeId);
  }

  saveHikeSettings(updatedHikeSettings: HikeSettings): void {
    /*this._store.dispatch(
      actions.changeHikeSettings({
        hikeSettings: { ...updatedHikeSettings, id: this.hikeId },
      })
    );*/
  }
}
