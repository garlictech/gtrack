import { routeCoordinates } from './fixtures';
import { pipe } from 'fp-ts/lib/function';
import { RouteFp } from '../route';
import * as fp from 'lodash/fp';
import * as O from 'fp-ts/lib/Option';

const averageSpeed = 1;

describe('Route calculation tests', () => {
  test('Calculate route from route coordinates', () => {
    pipe(
      routeCoordinates(),
      RouteFp.fromCoordinates(averageSpeed),
      fp.tap(route => expect(route).toMatchSnapshot())
    );
  });

  test('toRouteData', () => {
    pipe(
      routeCoordinates(),
      RouteFp.fromCoordinates(averageSpeed),
      O.chain(RouteFp.toRouteData),
      fp.tap(route => expect(route).toMatchSnapshot())
    );
  });

  test('toRouteSegmentsByWaypoints: less segments than route', () => {
    pipe(
      routeCoordinates(),
      fp.take(10),
      RouteFp.toRouteSegmentsByWaypoints([2, 2, 3]),
      fp.tap(segments => expect(segments).toMatchSnapshot())
    );
  });

  test('toRouteSegmentsByWaypoints: longer segments than route', () => {
    pipe(
      routeCoordinates(),
      fp.take(10),
      RouteFp.toRouteSegmentsByWaypoints([2, 2, 10]),
      fp.tap(segments => expect(segments).toMatchSnapshot())
    );
  });

  test('toRouteSegmentsByWaypoints: same segments than route', () => {
    pipe(
      routeCoordinates(),
      fp.take(10),
      RouteFp.toRouteSegmentsByWaypoints([2, 2, 3, 3]),
      fp.tap(segments => expect(segments).toMatchSnapshot())
    );
  });

  test('toRouteSegmentsByWaypoints: empty waypoints', () => {
    pipe(
      routeCoordinates(),
      fp.take(10),
      RouteFp.toRouteSegmentsByWaypoints([]),
      fp.tap(segments => expect(segments).toMatchSnapshot())
    );
  });

  test('toRouteSegmentsByWaypoints: empty route', () => {
    pipe(
      routeCoordinates(),
      fp.take(0),
      RouteFp.toRouteSegmentsByWaypoints([2]),
      fp.tap(segments => expect(segments).toMatchSnapshot())
    );
  });

  test('toRouteSegmentsByWaypoints: only one segment', () => {
    pipe(
      routeCoordinates(),
      fp.take(2),
      RouteFp.toRouteSegmentsByWaypoints([2]),
      fp.tap(segments => expect(segments).toMatchSnapshot())
    );
  });

  test('toRouteSegmentsByWaypoints: failed calculation with wrong coordinates', () => {
    pipe(
      routeCoordinates(),
      fp.take(10),
      x => x.concat([-1, -2, -3]),
      RouteFp.toRouteSegmentsByWaypoints([2, 3, 10]),
      fp.tap(segments => expect(segments).toMatchSnapshot())
    );
  });

  test('toRouteSegmentsByWaypoints: failed calculation with wrong indexes', () => {
    pipe(
      routeCoordinates(),
      fp.take(10),
      RouteFp.toRouteSegmentsByWaypoints([2, 3, -10]),
      fp.tap(segments => expect(segments).toMatchSnapshot())
    );
  });
});
