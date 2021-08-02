import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Position, LineString } from '@turf/helpers';
import {
  RouteSegmentFp,
  RouteSegment,
} from '@bit/garlictech.universal.gtrack.route-segment';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import { get, map as _map } from 'lodash';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { foldObservableOption } from '@bit/garlictech.universal.gtrack.fp';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';

interface RoutingResponse {
  paths: {
    points: LineString;
  }[];
}

@Injectable({ providedIn: 'root' })
export class RoutePlannerApiService {
  constructor(private readonly http: HttpClient) {}

  getRoute(p1: Point, p2: Point): Observable<RouteSegment> {
    const _urlParams = {
      vehicle: 'hike',
      instructions: false,
      locale: 'en',
      key: environment.graphhopper.apiKey,
      points_encoded: false,
    };

    const _urlParamsStr = _map(_urlParams, (v, k) => `${k}=${v}`);
    const request = `https://graphhopper.com/api/1/route?point=${p1.lat},${
      p1.lon
    }&point=${p2.lat},${p2.lon}&${_urlParamsStr.join('&')}`;

    return this.http.get(request).pipe(
      map(response =>
        get(response as RoutingResponse, 'paths[0].points.coordinates')
      ),
      switchMap((coordinates: Position[]) =>
        coordinates
          ? of(coordinates)
          : throwError('Wrong response from graphhopper API')
      ),
      map(
        RouteSegmentFp.fromCoordinatesWithElevation(
          GtrackDefaults.averageSpeed()
        )
      ),
      switchMap(foldObservableOption)
    );
  }
}
