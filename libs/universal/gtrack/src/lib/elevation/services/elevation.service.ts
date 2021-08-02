import { Observable, concat } from 'rxjs';
import { map, toArray } from 'rxjs/operators';
import * as fp from 'lodash/fp';
import { Reader } from 'fp-ts/lib/Reader';
import * as Either from 'fp-ts/lib/Either';
import * as A from 'fp-ts/lib/Array';
import { pipe, flow } from 'fp-ts/lib/function';

interface ElevationService {
  getElevationForLocations<POINT extends { lat: number; lon: number }>(
    points: POINT[]
  ): Observable<Either.Either<any, number[]>>;
}

type GetDataDeps<POSITION> = Reader<
  ElevationService,
  Observable<Either.Either<any, POSITION[]>>
>;

export const getElevationOfPoints = <
  POINT extends { lat: number; lon: number }
>(
  points: POINT[]
): GetDataDeps<POINT> => deps =>
  pipe(
    points,
    fp.chunk(500),
    fp.map(deps.getElevationForLocations),
    // See: https://github.com/ReactiveX/rxjs/issues/4697
    x => concat(...x),
    toArray(),
    map(
      flow(
        A.array.sequence(Either.either),
        Either.map(
          flow(fp.flatten, elevations =>
            elevations.map((elevation, i) => ({
              ...fp.cloneDeep(points[i]),
              elevation,
            }))
          )
        )
      )
    )
  );
