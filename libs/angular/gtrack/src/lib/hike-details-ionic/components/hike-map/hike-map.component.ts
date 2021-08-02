import { BehaviorSubject, Observable } from 'rxjs';
import { AfterViewInit, Component, Input } from '@angular/core';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import { WeatherEntity } from '@bit/garlictech.angular.gtrack.weather/store';
import { Position } from '@turf/helpers';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';

@Component({
  selector: 'gtrack-hike-map',
  templateUrl: './hike-map.component.html',
  styles: ['./hike-map.component.scss'],
})
export class HikeMapComponent implements AfterViewInit {
  @Input() hike: Observable<CalculatedHike>;
  @Input() route: Route;
  @Input() pois: Poi[];

  @Input() startDate: Date;

  @Input() weather: WeatherEntity;

  @Input() speed: number;

  viewInitialized: boolean;
  elevationMarkerPosition$: BehaviorSubject<Position>;
  elevationMarkerVisible$: BehaviorSubject<boolean | null>;
  elevationMarkerLocked$: BehaviorSubject<boolean | null>;

  constructor() {
    this.elevationMarkerPosition$ = new BehaviorSubject<Position>([0, 0]);
    this.elevationMarkerVisible$ = new BehaviorSubject<boolean | null>(false);
    this.elevationMarkerLocked$ = new BehaviorSubject<boolean | null>(false);

    this.viewInitialized = false;
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.viewInitialized = true;
    });
  }

  onElevationLineOver(): void {
    const locked = this.elevationMarkerLocked$.getValue();

    if (!locked) {
      this.elevationMarkerVisible$.next(true);
    }
  }

  onElevationLineMove(position: Position): void {
    const locked = this.elevationMarkerLocked$.getValue();

    if (!locked) {
      this.elevationMarkerPosition$.next(position);
    }
  }

  onElevationMarkerClick(): void {
    this.elevationMarkerLocked$.next(false);
  }

  onElevationLineClick(position: Position): void {
    this.elevationMarkerPosition$.next(position);
    this.elevationMarkerVisible$.next(true);
    this.elevationMarkerLocked$.next(true);
  }

  onElevationLineClickMap(data: {
    position: GeoJSON.Position;
    forced?: boolean;
  }): void {
    this.elevationMarkerPosition$.next(data.position);
    this.elevationMarkerVisible$.next(true);
    this.elevationMarkerLocked$.next(true);
  }

  onElevationLineOut(): void {
    const locked = this.elevationMarkerLocked$.getValue();

    if (!locked) {
      this.elevationMarkerVisible$.next(false);
    }
  }
}
