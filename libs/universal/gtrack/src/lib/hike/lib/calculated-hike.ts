import { HikeData } from '@bit/garlictech.universal.gtrack.graphql-api';
import { RouteFp, Route } from '@bit/garlictech.universal.gtrack.route';
import * as fp from 'lodash/fp';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';

export interface CalculatedHike {
  readonly route: Route;
  readonly id: string;
  readonly data: HikeData;
}

export class CalculatedHikeFp {
  static fromHikeData(data: HikeData): O.Option<CalculatedHike> {
    return pipe(
      data,
      O.fromPredicate(hike => !fp.isEmpty(hike?.id)),
      O.map(data => data?.route),
      O.chain(RouteFp.fromRouteData),
      O.map(route => ({
        id: data?.id,
        route,
        data,
      }))
    );
  }
}
