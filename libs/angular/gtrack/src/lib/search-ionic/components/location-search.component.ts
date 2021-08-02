import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  NgModule,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  GeoPosition,
  GeoLocationService,
  CurrentGeolocationStoreModule,
} from '@bit/garlictech.angular.gtrack.current-geolocation';
import { GoogleMapsService } from '@bit/garlictech.angular.gtrack.google-maps';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faMapMarker, faGlobe } from '@fortawesome/pro-light-svg-icons';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import distance from '@turf/distance';
import { Position, Coord as turfCoord } from '@turf/helpers';
import { get as _get } from 'lodash';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { NEVER, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'gtrack-location-search',
  template: `
    <div class="search-container ">
      <fa-icon [icon]="searchIcon"></fa-icon>
      <input
        #search
        [placeholder]="
          'common.hike.location-search.search-location' | translate
        "
        autocorrect="off"
        autocapitalize="off"
        spellcheck="off"
        onfocus="this.value=''"
      />
    </div>

    <div class="mt-6 flex flex-row content-center justify-center">
      <div class="self-center inline-block h-full">
        <ion-button
          style="--border-style: none"
          block
          fill="outline"
          size="small"
          class="flex items-center self-center search-text text-base"
          (click)="requestLocation()"
        >
          <fa-icon [icon]="aroundMeIcon"></fa-icon>
          <span>{{
            'common.hike.location-search.use-my-location' | translate
          }}</span>
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./search.styles.scss'],
})
export class LocationSearchComponent implements OnInit {
  @Output() readonly search = new EventEmitter<Position>();

  searchIcon: IconDefinition = faGlobe;
  aroundMeIcon: IconDefinition = faMapMarker;

  protected _location?: Position;
  protected _address: string;
  @ViewChild('search', { read: ElementRef, static: true })
  _searchElementRef: ElementRef;

  _input: HTMLElement;
  private readonly _locate$: Subject<boolean>;

  constructor(
    private readonly _googleMapsService: GoogleMapsService,
    private readonly _ngZone: NgZone,
    private readonly _geolocationService: GeoLocationService
  ) {
    this._address = 'my-location';
    this._locate$ = new Subject<boolean>();
  }

  ngOnInit(): void {
    if (typeof this._searchElementRef.nativeElement !== 'undefined') {
      this._input = this._searchElementRef.nativeElement;

      if (!(this._input instanceof HTMLInputElement)) {
        const input = this._input.querySelector('input');

        if (input !== null) {
          this._input = input;
        }
      }
    }

    if (this._input instanceof HTMLInputElement) {
      this._googleMapsService
        .autocomplete(this._input)
        .then(autocomplete => {
          autocomplete.addListener('place_changed', () => {
            this._ngZone.run(() => {
              const place = autocomplete.getPlace();

              if (
                typeof place.geometry === 'undefined' ||
                place.geometry === null
              ) {
                return undefined;
              } else { return place.geometry };


              this._locate$.next(false);

              this._location = [
                place.geometry.location.lng(),
                place.geometry.location.lat(),
              ];
              this._address = place.formatted_address;
              this.searchLocation();
            });
          });
        })
        .catch(() => undefined);
    }

    this._initLocation();
  }

  searchLocation(): void {
    if (this._input instanceof HTMLInputElement) {
      this._input.value = '';
    }

    this._locate$.next(false);
    this.search.emit(this._location);
  }

  requestLocation(): void {
    if (this._input instanceof HTMLInputElement) {
      this._input.value = '';
      this._location = undefined;
    }

    this._locate$.next(true);
  }

  private _initLocation(): void {
    const location$ = this._geolocationService.getLocation().pipe(
      filter(
        (location?: GeoPosition) =>
          !!_get(location, 'coords.longitude') &&
          !!_get(location, 'coords.latitude')
      ),
      map((location?: GeoPosition) => [
        location?.coords.longitude,
        location?.coords.latitude,
      ]),
      distinctUntilChanged((position1, position2) => {
        const point1: turfCoord = {
          type: 'Point',
          coordinates: [position1[0] as number, position1[1] as number],
        };

        const point2: turfCoord = {
          type: 'Point',
          coordinates: [position2[0] as number, position2[1] as number],
        };

        return distance(point1, point2) <= 0.1;
      })
    );

    this._locate$
      .pipe(
        switchMap(locate => (locate ? location$ : NEVER)),
        untilDestroyed(this)
      )
      .subscribe((coords: any) => {
        this._address = 'my-location';
        this._location = coords;
        this.search.next(this._location);
      });
  }
}

@NgModule({
  declarations: [LocationSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    FontAwesomeModule,
    IonicModule,
    CurrentGeolocationStoreModule,
  ],
  exports: [LocationSearchComponent],
  providers: [],
})
export class LocationSearchComponentModule { }
