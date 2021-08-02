import {
  AfterViewInit,
  Component,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  HikeStopMarkerService,
  LeafletMapMarker,
} from '@bit/garlictech.angular.gtrack.leaflet-map';
import { Observable } from 'rxjs';
import { Map, LatLngBounds, LatLng } from 'leaflet';
import * as fp from 'lodash/fp';

@Component({
  selector: 'gtrack-poi-map',
  template: `
    <div class="map-container">
      <gtrack-leaflet-map
        class="h-full"
        (theMap)="onTheMap($event)"
        [markers$]="markers$"
      ></gtrack-leaflet-map>
      <gtrack-leaflet-control
        [map]="theMap"
        [poiControlShown]="false"
        (resetRequested)="resetMap()"
      ></gtrack-leaflet-control>
    </div>
  `,
  styleUrls: ['./poi-map.component.scss'],
})
export class PoiMapComponent implements AfterViewInit {
  @Input() set poi(poi: Poi) {
    if (fp.isObject(poi)) {
      this.markers$ = this.hikeStopMarkerService.generatePoiMapMarkers([poi]);
    }
  }

  theMap: Map;
  fitBounds: LatLngBounds;
  markers$: Observable<LeafletMapMarker[]>;

  constructor(
    private readonly hikeStopMarkerService: HikeStopMarkerService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.fitBounds = this.theMap.getBounds();
    this.resetMap();
  }

  onTheMap(event$: Map): void {
    this.theMap = event$;
  }

  resetMap(): void {
    this.theMap.setView(new LatLng(this.poi.lat, this.poi.lon), 15);
    this.changeDetector.detectChanges();
  }
}
