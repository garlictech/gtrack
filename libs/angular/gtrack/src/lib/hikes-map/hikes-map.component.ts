import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Circle } from '@bit/garlictech.universal.gtrack.geometry';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'gtrack-common-hikes-map',
  template: `
    <div class="map-container">
      <gtrack-map
        [routes$]="routes$"
        [showSpinner]="isSearching"
        [searchCircle$]="searchCircle$"
      ></gtrack-map>
    </div>
  `,
  styleUrls: ['./hikes-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HikesMapComponent implements OnInit {
  @Input() hikes$: Observable<CalculatedHike[]>;
  @Input() highlighted?: CalculatedHike;
  @Input() searchCircle$?: Observable<Circle>;
  @Input() isSearching!: boolean;

  @Output() readonly hikeClick: EventEmitter<CalculatedHike>;

  routes$: Observable<Route[]>;

  constructor() {
    this.hikeClick = new EventEmitter<CalculatedHike>();
  }

  ngOnInit(): void {
    this.routes$ = this.hikes$.pipe(
      filter(fp.isArray),
      map(fp.map(hike => hike.route))
    );
  }

  // highlightMarker(hike?: CalculatedHike): void {
  //   let others = this._markers;
  //   let activeMarker: LeafletMapMarker | undefined;

  //   if (hike && hike.id) {
  //     const id = hike.id;

  //     activeMarker = this._markers.find(marker => marker.popupData.data.hike.id === id);
  //     others = this._markers.filter(marker => marker.popupData.data.hike.id !== id);
  //   }

  //   others.forEach(marker => marker.removeHighlight());

  //   if (activeMarker) {
  //     activeMarker.addHighlight();
  //   }
  // }
}
