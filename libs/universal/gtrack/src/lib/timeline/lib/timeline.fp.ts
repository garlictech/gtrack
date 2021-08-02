import { map as _map } from 'lodash';
import * as gtfp from '@bit/garlictech.universal.gtrack.fp';
import * as O from 'fp-ts/lib/Option';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import {
  distanceFromRoute,
  snappedLineSlice,
} from '@bit/garlictech.universal.gtrack.geometry/lib/line-calculations';
import { Point } from '@bit/garlictech.universal.gtrack.graphql-api';
import { CalculatedHike } from '@bit/garlictech.universal.gtrack.hike/lib/calculated-hike';
import { Route } from '@bit/garlictech.universal.gtrack.route/lib/types';
import { RouteSegmentFp } from '@bit/garlictech.universal.gtrack.route-segment/lib/route-segment';
import * as fp from 'lodash/fp';

import { flow, pipe } from 'fp-ts/lib/function';
import { PoiIconsFp } from '@bit/garlictech.universal.gtrack.poi-icons/lib/poi-icons.fp';
import {
  HikeStop,
  HikeStopFp,
  HikeStopSetDetails,
} from '@bit/garlictech.universal.gtrack.hike-stops/lib/hike-stop';
import {
  TimelineDeps,
  Timeline,
  TimelineItem,
  TimelineTranslationDeps,
} from './types';
import { approximateDistance } from '@bit/garlictech.universal.gtrack.geometry/lib/geospatial-calculations';
import {
  MultiLanguageTextFp,
  TextualDescriptionType,
} from '@gtrack/shared/localization/utils';

const nextStopDistance = (
  stop: HikeStop,
  nextStop: HikeStop
): number | undefined =>
  fp.isObject(nextStop)
    ? nextStop.distanceFromStart - stop.distanceFromStart
    : undefined;

const createStartHikeStop = (startPoint: Point) => (
  firstStop?: HikeStop
): HikeStop[] => {
  const startTag = 'start';

  const addStartTag = () => {
    // nullness checked at return
    const newStop = fp.cloneDeep(firstStop) as HikeStop;
    newStop.poi.types = newStop.poi.types || [];
    newStop.poi.types.push(startTag);

    return {
      ...startPoint,
      ...newStop,
      distanceFromStart: 0,
      distanceFromRoute: 0,
    };
  };

  const createStartStop = (): HikeStop => ({
    hikeId: fp.uniqueId('tmphike'),
    distanceFromStart: 0,
    distanceFromRoute: 0,
    onRoute: true,
    offRoute: false,
    inBigBuffer: true,
    poi: {
      id: fp.uniqueId('tmpstart'),
      lat: startPoint.lat,
      lon: startPoint.lon,
      // TODO fail the calculation if there is no elevation (Option...)
      elevation: startPoint.elevation ?? 0,
      description: [
        {
          languageKey: MultiLanguageTextFp.translatableTagLangKey(),
          title: startTag,
          type: TextualDescriptionType.html,
        },
      ],
      types: [startTag],
      // TODO consider NOT using HikeStop for such auxiliary stops...
      sourceObject: [],
    },
  });

  return firstStop
    ? approximateDistance(startPoint, firstStop.poi) <
      GtrackDefaults.distanceOfSamePoisInMeters()
      ? [addStartTag()]
      : [createStartStop(), firstStop]
    : [createStartStop()];
};

const createFinishHikeStop = (route: Route) => (
  lastStop: HikeStop
): HikeStop[] => {
  const finishTag = 'finish';
  const routeLength = route.distance;
  const endPoint = route.endPoint;

  const addFinishTag = () => {
    const newStop = fp.cloneDeep(lastStop);
    newStop.poi.types = newStop.poi.types || [];
    newStop.poi.types.push(finishTag);

    return {
      ...newStop,
      distanceFromStart: routeLength,
      distanceFromRoute: 0,
      ...endPoint,
    };
  };

  const createFinishStop = (): HikeStop => ({
    hikeId: fp.uniqueId('tmphike'),
    distanceFromStart: routeLength,
    distanceFromRoute: 0,
    onRoute: true,
    offRoute: false,
    inBigBuffer: true,
    poi: {
      id: fp.uniqueId('tmpstop'),
      lat: endPoint.lat,
      lon: endPoint.lon,
      // TODO fail the calculation if there is no elevation (Option...)
      elevation: endPoint.elevation ?? 0,
      description: [
        {
          languageKey: MultiLanguageTextFp.translatableTagLangKey(),
          title: finishTag,
          type: TextualDescriptionType.html,
        },
      ],
      types: [finishTag],
      sourceObject: [],
    },
  });

  return approximateDistance(endPoint, lastStop.poi) <
    GtrackDefaults.distanceOfSamePoisInMeters()
    ? [addFinishTag()]
    : [lastStop, createFinishStop()];
};

const getBackgroundColor = (stop: HikeStop): string =>
  pipe(
    O.fromNullable(stop.poi?.types?.[0]),
    O.chain(PoiIconsFp.getDefaultIconColor),
    O.getOrElse(() => '#ffffff')
  );

const getClickRoute = fp.flow(fp.get('poi.id'), id =>
  fp.isString(id) ? `/poi/${id}` : undefined
);

export class TimelineFp {
  static createTimeline = (deps: TimelineDeps) => (
    hike: CalculatedHike
  ): Timeline => {
    const route = hike.route;
    const startPoint = hike.route.startPoint;

    const getCurrentRouteSegmentFv = flow(
      fp.mapValues(fp.get('poi')),
      p => snappedLineSlice(p.current, p.next, route.track),
      // TODO use option...
      line => line?.geometry?.coordinates,
      O.fromNullable,
      O.chain(RouteSegmentFp.fromCoordinatesWithElevation(deps.averageSpeed))
    );

    const collectNearbyPoisFv = (offrouteStops: HikeStop[]) =>
      fp.flow(
        getCurrentRouteSegmentFv,
        x => x,
        O.map(segmentGeojson =>
          fp.filter(
            (stop: HikeStop) =>
              distanceFromRoute(stop.poi, segmentGeojson.geojsonFeature) <=
              GtrackDefaults.bigRouteBufferSize(),
            offrouteStops
          )
        ),
        O.getOrElse(() => [])
      );

    const calculateTimelineRelatedProperties = (offrouteStops: HikeStop[]) => (
      pair: gtfp.Pair<HikeStop>
    ) =>
      flow(
        getCurrentRouteSegmentFv,
        O.map(({ uphill, downhill, score, averageTime, difficulty }) => ({
          uphill,
          downhill,
          score,
          averageTime,
          difficulty,
          nearbyStopsOfNextSegment: collectNearbyPoisFv(offrouteStops)(pair),
        }))
      )(pair);

    const calculateSegmentData = (
      pair: gtfp.Pair<HikeStop>,
      offrouteStops: HikeStop[]
    ) =>
      gtfp.checkIfPairsAreObjects(pair)
        ? calculateTimelineRelatedProperties(offrouteStops)(pair)
        : O.none;

    const prepareStart = (stops: HikeStop[]) =>
      fp.flow(fp.first, createStartHikeStop(startPoint), newStops =>
        fp.concat(newStops, fp.tail(stops))
      )(stops);

    const prepareFinish = (stops: HikeStop[]) =>
      fp.flow(fp.last, createFinishHikeStop(route), newStops =>
        fp.concat(fp.initial(stops), newStops)
      )(stops);

    const calculateArriveTime = (
      index: number,
      collection: TimelineItem[]
    ): number =>
      fp.flow(
        fp.slice(0, index),
        fp.map('time'), // time is in minutes
        fp.map(gtfp.convertMinutesToMilliseconds),
        fp.reduce(fp.add, fp.now())
      )(collection);

    const calculateTotalProperty = (
      index: number,
      collection: TimelineItem[],
      key: string
    ): number =>
      fp.flow(
        fp.slice(0, index),
        fp.map(key),
        fp.reduce(fp.add, 0)
      )(collection);

    const addCumulatedProperties = (items: TimelineItem[]): TimelineItem[] =>
      _map(
        items,
        (
          item: TimelineItem,
          index: number,
          collection: TimelineItem[]
        ): TimelineItem => ({
          ...item,
          arrive: calculateArriveTime(index, collection),
          totalScore: calculateTotalProperty(index, collection, 'score'),
          totalUphill: calculateTotalProperty(index, collection, 'uphill'),
        })
      );

    const createTimelineItemBasicProperties = (offrouteStops: HikeStop[]) => (
      pair: gtfp.Pair<HikeStop>
    ): Partial<TimelineItem> => ({
      stop: pair.current,
      backgroundColor: getBackgroundColor(pair.current as HikeStop),
      link: getClickRoute(pair.current),
      nextStopDistance: nextStopDistance(
        pair.current as HikeStop,
        pair.next as HikeStop
      ),
      ...calculateSegmentData(pair, offrouteStops),
    });

    const removeNextStopsWithNegativeDistanceToNext = fp.filter(
      fp.flow(
        fp.property('nextStopDistance'),
        value => fp.isNil(value) || value > 0
      )
    );

    return pipe(
      deps.onrouteStops,
      prepareStart,
      prepareFinish,
      gtfp.pairwise,
      fp.map(createTimelineItemBasicProperties(deps.offrouteStops)),
      removeNextStopsWithNegativeDistanceToNext,
      addCumulatedProperties
    );
  };

  static addStopDetails = (deps: TimelineTranslationDeps) => (
    timeline: Array<Omit<TimelineItem, 'stopDetails'>>
  ): Timeline =>
    timeline.map(item => ({
      ...item,
      stopDetails: pipe(
        [item.stop],
        HikeStopFp.getDetailsOfStops(deps.currentLanguage)(deps.translator),
        O.getOrElse(
          () => ({ typeDetails: [], titleList: [] } as HikeStopSetDetails)
        )
      ),
    }));
}
