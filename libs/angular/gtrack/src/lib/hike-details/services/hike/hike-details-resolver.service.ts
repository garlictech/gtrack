import { fromWorker } from 'observable-webworker';
import { Injectable } from '@angular/core';
import { Image } from '@bit/garlictech.universal.gtrack.graphql-api';
import { Store } from '@ngrx/store';
import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import {
  CalculatedHike,
  ResolvedHikeData,
} from '@bit/garlictech.universal.gtrack.hike';
import { HikeService } from './hike.service';
import { ObjectsInBufferResolverService } from './objects-in-buffer-resolver.service';
import { TimelineService } from '@bit/garlictech.angular.gtrack.timeline';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import { HikeStopActions } from '../../../hike-stops/store';
import {
  HikeStopWorkerInput,
  HikeStopWorkerOutput,
} from '../../../webworkers/create-hike-stops/types';

const maxImageNo = 15;

@Injectable({ providedIn: 'root' })
export class HikeDetailsResolverService {
  constructor(
    private readonly hikeService: HikeService,
    private readonly objectsInBuffer: ObjectsInBufferResolverService,
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly store: Store<any>,
    private readonly timelineService: TimelineService
  ) {}

  resolve(): Observable<ResolvedHikeData> {
    return this.hikeService.resolveByRouteParam().pipe(
      filter<CalculatedHike>(fp.isObject),
      switchMap(hike => this.resolveHike(hike))
    );
  }

  resolveByHikeId(hikeId: string): Observable<ResolvedHikeData> {
    return this.hikeService.getByKey(hikeId).pipe(
      filter<CalculatedHike>(fp.isObject),
      switchMap(hike => this.resolveHike(hike))
    );
  }

  resolveHike(hike: CalculatedHike): Observable<ResolvedHikeData> {
    return this.objectsInBuffer.resolve(hike.route.bigBuffer, maxImageNo).pipe(
      switchMap(items =>
        fromWorker<HikeStopWorkerInput, HikeStopWorkerOutput>(
          () =>
            new Worker(
              '../../../webworkers/create-hike-stops/create-hike-stops.worker',
              {
                type: 'module',
              }
            ),
          of({ items, hike })
        )
      ),
      tap(({ stops }) =>
        this.store.dispatch(HikeStopActions.AddHikeStops({ stops }))
      ),
      map(({ pois, images, checkpoints }) => ({
        pois,
        images,
        checkpoints,
        hike,
      })),
      switchMap(({ pois, images, checkpoints }) =>
        this.timelineService
          .createTimeline(GtrackDefaults.averageSpeed())(hike)
          .pipe(
            map(timeline => ({
              hike,
              pois,
              images,
              checkpoints,
              timeline,
            }))
          )
      )
    );
  }

  resolveImages(hike: CalculatedHike): Observable<Image[]> {
    return this.objectsInBuffer
      .resolveSafeImages(hike.route.bigBuffer, maxImageNo)
      .pipe(map(images => fp.shuffle(images)));
  }
}
