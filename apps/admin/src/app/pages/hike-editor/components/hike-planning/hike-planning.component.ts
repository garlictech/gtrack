import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { TimelineComponentModule } from '@bit/garlictech.angular.gtrack.timeline-ionic';
import { Store } from '@ngrx/store';
import { HikeEditorSelectors } from '@admin/features/hike-editor';
import { HikeStopCollectorModule } from '@admin/features/hike-stops-admin';
import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { NbAccordionModule, NbCheckboxModule } from '@nebular/theme';

@Component({
  selector: 'gtrack-hike-planning',
  templateUrl: './hike-planning.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikePlanningComponent {
  hike$: Observable<CalculatedHike>;
  showTimeline = false;

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private readonly store: Store<any>) {
    this.hike$ = this.store
      .select(HikeEditorSelectors.getCalculatedHike)
      .pipe(distinctUntilChanged(fp.isEqual));
  }
}

@NgModule({
  imports: [
    HikeStopCollectorModule,
    TimelineComponentModule,
    CommonModule,
    FormsModule,
    NbAccordionModule,
    NbCheckboxModule,
  ],
  exports: [HikePlanningComponent],
  declarations: [HikePlanningComponent],
})
export class HikePlanningModule {}
