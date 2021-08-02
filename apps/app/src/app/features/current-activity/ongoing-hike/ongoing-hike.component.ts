import { NGXLogger } from 'ngx-logger';
import { CommonHeaderModule } from '@bit/garlictech.angular.gtrack.gtrack-header';
import { HikeDetailsModule } from '@bit/garlictech.angular.gtrack.hike-details-ionic';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { TrailBoxComponentModule } from '@bit/garlictech.angular.gtrack.hike-details-ionic';
import { HikeFlowControlComponentModule } from '../hike-flow-control.component';
import { Map, LayerGroup } from 'leaflet';
import { HikeMovingInfoControlComponentModule } from '../hike-moving-info-control.component';
import { Track } from '@bit/garlictech.angular.gtrack.track/lib/track';
import { HikeMovingTimelineControlComponentModule } from '../hike-timeline-control/hike-moving-timeline-control.component';
import { OngoingHikeService } from './ongoing-hike.service';
import { PoiStampComponentModule } from '../poi-stamp/poi-stamp.component';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { ResolvedHikeData } from '@bit/garlictech.universal.gtrack.hike';

@UntilDestroy()
@Component({
  selector: 'gtrack-app-ongoing-hike',
  templateUrl: './ongoing-hike.component.html',
  styleUrls: ['./ongoing-hike.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OngoingHikeComponent implements OnInit {
  @Input() resolvedHike$: Observable<ResolvedHikeData>;
  @Input() isMoving$: Observable<boolean>;
  @Input() recordedTrack$: Observable<Track>;
  @Input() nextPoiToPass$: Observable<Poi>;

  theMap: Map;
  extraFeatureOverlays$?: Observable<LayerGroup[]>;
  isSimulationMode: boolean;

  constructor(
    private readonly log: NGXLogger,
    private changeDetector: ChangeDetectorRef,
    private readonly logic: OngoingHikeService
  ) {
    this.isSimulationMode = logic.isSimulationMode;
  }

  ngOnInit(): void {
    this.extraFeatureOverlays$ = this.logic.init(
      this.resolvedHike$,
      this.recordedTrack$
    );

    this.logic
      .getOnroutePoisPassed$(this.resolvedHike$, this.recordedTrack$)
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  onTheMap(event$: Map): void {
    this.theMap = event$;
    this.changeDetector.detectChanges();
  }

  activityCleared(): void {
    if (this.resolvedHike$) {
      this.logic.activityCleared(this.resolvedHike$);
    }
  }
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [OngoingHikeComponent],
  imports: [
    CommonModule,
    TranslateModule,
    TrailBoxComponentModule,
    HikeFlowControlComponentModule,
    HikeDetailsModule,
    CommonHeaderModule,
    HikeMovingInfoControlComponentModule,
    HikeMovingTimelineControlComponentModule,
    PoiStampComponentModule,
  ],
  exports: [OngoingHikeComponent],
  providers: [OngoingHikeService],
})
export class OngoingHikeComponentModule {}
