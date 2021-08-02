import { Component, Inject, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, delay, filter, map, retryWhen } from 'rxjs/operators';
import {
  CURRENT_GEOLOCATION_CONFIG,
  CurrentGeolocationConfig,
  GeoCoordinates,
} from '../../interfaces';
import { selectCurrentLocation } from '../../store';

@Component({
  selector: 'app-current-geolocation',
  template: '',
})
export class CurrentGeoLocationComponent implements OnInit {
  currentLocation$!: Observable<GeoCoordinates>;
  errorMessage: string;
  constructor(
    private readonly _store: Store,
    @Inject(CURRENT_GEOLOCATION_CONFIG)
    private readonly config: CurrentGeolocationConfig
  ) { }

  ngOnInit(): void {
    this.getCurrentLocation();
  }

  getCurrentLocation(): Observable<GeoCoordinates> {
    return (this.currentLocation$ = this._store.pipe(
      select(selectCurrentLocation),
      x => x,
      filter(location => !!location),
      map(location => location!.coords as GeoCoordinates),
      x => x,
      retryWhen(errors => errors.pipe(delay(this.config.timeOut))),
      catchError(err => {
        this.errorMessage = 'Cannot obtain coordinates...';

        return of(err);
      }),
    ));
  }
}
