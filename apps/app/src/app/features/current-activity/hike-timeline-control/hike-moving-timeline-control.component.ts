import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
} from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Map, Control } from 'leaflet';
import { Observable } from 'rxjs';
import { Track } from '@bit/garlictech.angular.gtrack.track';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsModule } from '@bit/garlictech.angular.gtrack.utils/utils.module';
import { SharedLocalizationFeatureIonicModule } from '@gtrack/shared/localization/feature-ionic';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';

@UntilDestroy()
@Component({
  selector: 'gtrack-app-hike-moving-timeline-control',
  template: `
    <ng-container *ngIf="isMoving">
      <div
        class="control-content text-black inline-block"
        *ngIf="recordedTrack$ | async as track"
      >
        NEXt POI:
        {{
          ((nextPoiToPass$ | async)?.description | localizeDescription)?.title
        }}
      </div>
    </ng-container>
  `,
  styleUrls: [
    '../current-activity.scss',
    './hike-moving-timeline-control.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeMovingTimelineControlComponent {
  @Input() isMoving = false;
  @Input() recordedTrack$: Observable<Track>;
  @Input() nextPoiToPass$: Observable<Poi>;

  @Input() set map(leafletMap: Map) {
    const element = this.elRef.nativeElement;
    if (leafletMap) {
      const Custom = Control.extend({
        onAdd() {
          return element;
        },
      });

      this.control = new Custom({
        position: 'bottomleft',
      });

      this.control.addTo(leafletMap);
    }
  }

  public control: Control;

  constructor(private elRef: ElementRef) {}
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [HikeMovingTimelineControlComponent],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    UtilsModule,
    SharedLocalizationFeatureIonicModule,
  ],
  exports: [HikeMovingTimelineControlComponent],
  providers: [],
})
export class HikeMovingTimelineControlComponentModule {}
