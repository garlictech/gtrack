import { DoWork, ObservableWorker } from 'observable-webworker';
import { Observable, of } from 'rxjs';

import { HikeStopFp } from '@bit/garlictech.universal.gtrack.hike-stops/lib/hike-stop';
import { map, switchMap } from 'rxjs/operators';
import * as fp from 'lodash/fp';
import { HikeStopWorkerOutput, HikeStopWorkerInput } from './types';

const filterObjectsByGraphqlType = (typename: string) => (items: any[]) =>
  fp.filter(fp.flow(fp.property('__typename'), fp.isEqual(typename)), items);

@ObservableWorker()
export class UpdateHikeStopsWorker
  implements DoWork<HikeStopWorkerInput, HikeStopWorkerOutput> {
  work(
    input$: Observable<HikeStopWorkerInput>
  ): Observable<HikeStopWorkerOutput> {
    const getImagesFv = fp.flow(
      filterObjectsByGraphqlType('Image'),
      fp.shuffle
    );

    return input$.pipe(
      switchMap(({ items, hike }) =>
        of({
          images: getImagesFv(items),
          pois: filterObjectsByGraphqlType('Poi')(items),
        }).pipe(
          map(({ pois, images }) => ({
            pois,
            images,
            stops: pois.map(poi =>
              HikeStopFp.create(poi, hike.route, hike.data.id)
            ),
            checkpoints: [],
            //checkpoints: CheckpointsLib.resolveCheckpoints(
            //  pois,
            //  hike.data.checkpoints as Checkpoint[],
            //  hike.route
            //),
          }))
        )
      )
    );
  }
}
