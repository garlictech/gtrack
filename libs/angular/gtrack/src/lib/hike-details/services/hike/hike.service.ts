import { Injectable, Injector } from '@angular/core';
import { HikingObjectCollectionServiceBase } from '@bit/garlictech.angular.gtrack.gtrack-data';
import { createPagedArrayLimitIndicator } from '@bit/garlictech.universal.gtrack.fp';
import {
  CreateHikeInput,
  PlaceType,
  Point
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { GeoLocationService } from '@bit/garlictech.angular.gtrack.current-geolocation';
import * as fp from 'lodash/fp';
import { EMPTY, Observable } from 'rxjs';
import {
  delay,
  expand,
  filter,
  map,
  reduce,
  switchMap,
  take,
  takeLast
} from 'rxjs/operators';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike';

@Injectable({ providedIn: 'root' })
export class HikeService extends HikingObjectCollectionServiceBase<
  CreateHikeInput,
  CalculatedHike
> {
  constructor(
    injector: Injector,
    private readonly _geolocationService: GeoLocationService
  ) {
    super('Hike', injector);
  }

  protected searchPlaceType: PlaceType = PlaceType.hike;

  searchShowcaseHikes(): Observable<CalculatedHike[]> {
    const numberOfShowcaseHikes = 3;
    const limitIndicator = createPagedArrayLimitIndicator(
      numberOfShowcaseHikes
    );

    const addResults = (
      foundHikes: CalculatedHike[],
      newHikes: CalculatedHike[]
    ): CalculatedHike[] =>
      fp.flow(
        fp.tap(
          fp.flow(fp.difference(fp.__, foundHikes), limitIndicator.addArray)
        ),
        fp.concat(foundHikes),
        fp.uniqBy('id')
      )(fp.uniqBy('id', newHikes));

    const getChunk = (center: Point, radius = 25000) =>
      this.searchInCircle({
        placeType: PlaceType.hike,
        circle: { center, radius },
        maxItemNo:
          numberOfShowcaseHikes *
          2 /* to count double hits (two hike endpoints are found) into account */
      }).pipe(
        map((items: CalculatedHike[]) => ({
          items,
          currentRadius: radius
        }))
      );

    return this._geolocationService.getLocation().pipe(
      filter(location => fp.isObject(location) && fp.isObject(location.coords)),
      take(1),
      map(location => ({
        lat: location!.coords.latitude,
        lon: location!.coords.longitude
      })),
      switchMap(center =>
        getChunk(center).pipe(
          expand(({ currentRadius }) =>
            !limitIndicator.limitReached() && currentRadius <= 25000000
              ? getChunk(center, currentRadius * 10).pipe(delay(500))
              : EMPTY
          ),
          reduce((acc, { items }) => addResults(acc, items), []),
          takeLast(1)
        )
      ),
      map(hikes => fp.sampleSize(numberOfShowcaseHikes, hikes))
    );
  }
}
