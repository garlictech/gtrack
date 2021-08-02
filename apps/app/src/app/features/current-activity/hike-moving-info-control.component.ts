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

@Component({
  selector: 'gtrack-app-hike-moving-info-control',
  template: `
    <ng-container *ngIf="isMoving">
      <div
        class="text-black w-auto inline-block"
        *ngIf="recordedTrack$ | async as track"
      >
        <div class="inline-block truncate">
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.startTime' | translate }}
            </div>
            <div class="value">{{ track?.startTime | date: 'HH:mm' }}</div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.fullTime' | translate }}
            </div>
            <div class="value">{{ track?.fullTime | duration }}</div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.movingTime' | translate }}
            </div>
            <div class="value">{{ track?.movingTime | duration }}</div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.distance' | translate }}
            </div>
            <div class="value">
              {{ track?.route?.distance | distance | async }}
            </div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.currentSpeed' | translate }}
            </div>
            <div class="value">{{ track?.currentSpeed }} km/h</div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.averageSpeed' | translate }}
            </div>
            <div class="value">{{ track?.averageSpeed }} km/h</div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.climbed' | translate }}
            </div>
            <div class="value">
              {{ track?.route?.uphill | distance | async }}
            </div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.descended' | translate }}
            </div>
            <div class="value">
              {{ track?.route?.downhill | distance | async }}
            </div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.passedOnroutePois' | translate }}
            </div>
            <div class="value">{{ track?.passedOnroutePois }}</div>
          </div>
          <div class="info-row">
            <div class="label">
              {{ 'features.currentActivity.passedOffroutePois' | translate }}
            </div>
            <div class="value">{{ track?.passedOffroutePois }}</div>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./current-activity.scss', './hike-moving-info-control.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikeMovingInfoControlComponent {
  @Input() isMoving = false;
  @Input() recordedTrack$: Observable<Track>;

  @Input() set map(map: Map) {
    const element = this.elRef.nativeElement;
    if (map) {
      const Custom = Control.extend({
        onAdd() {
          return element;
        },
      });

      this.control = new Custom({
        position: 'bottomleft',
      });

      this.control.addTo(map);
    }
  }

  public control: Control;

  constructor(private elRef: ElementRef) {}
}

// eslint:disable-next-line:max-classes-per-file
@NgModule({
  declarations: [HikeMovingInfoControlComponent],
  imports: [CommonModule, IonicModule, TranslateModule, UtilsModule],
  exports: [HikeMovingInfoControlComponent],
  providers: [],
})
export class HikeMovingInfoControlComponentModule {}
