import { approximateDistance } from '@bit/garlictech.universal.gtrack.geometry';
import {
  Poi,
  PoiSourceObject
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { pipe } from 'fp-ts/lib/function';
import {
  cloneDeep,
  concat as _concat,
  filter,
  flatten,
  intersection,
  isEmpty,
  isEqual,
  map as _map,
  omit,
  pull,
  pullAll,
  slice,
  uniq,
  uniqWith,
  without
} from 'lodash';
import * as fp from 'lodash/fp';
import { ExternalPoi } from './types';

function indexPoiPairsByDistance<POINT extends { lat: number; lon: number }>(
  points: POINT[]
): { distance: number; point1: POINT; point2: POINT }[] {
  const indexedPairsbyDistance = _map(points, (point1, index) => {
    const processedPoisRemoved = slice(points, index + 1);
    return _map(processedPoisRemoved, point2 => ({
      distance: approximateDistance(point1, point2),
      point1,
      point2
    }));
  });

  return fp.sortBy(['distance'], fp.flatten(indexedPairsbyDistance));
}

type PoiGroupingInputType = Readonly<ExternalPoi> | Poi;
type PoiGroupingOutputType = ExternalPoi | Poi;

const removeUnusedGraphqlFields = fp.map(
  fp.flow(fp.omit(['__typename']), fp.omitBy(fp.isNull))
);

const mergeSourceObjects = (
  pois: PoiGroupingInputType[],
  targetPoi: PoiGroupingOutputType
): PoiSourceObject[] =>
  fp.flow(
    fp.map('sourceObject'),
    fp.flatten,
    fp.concat(targetPoi.sourceObject),
    fp.reverse,
    removeUnusedGraphqlFields,
    fp.uniqWith(fp.isEqual)
  )(pois);

export const mergePois = (
  pois: PoiGroupingInputType[],
  targetPoi: PoiGroupingOutputType
): PoiGroupingOutputType => ({
  ...omit(targetPoi, ['sourceObject', 'description', 'types']),
  address: fp.isNull(targetPoi.address) ? undefined : targetPoi.address,
  sourceObject: mergeSourceObjects(pois, targetPoi),
  description: uniqWith(
    uniqWith(
      flatten(_concat(targetPoi.description, fp.map('description')(pois))),
      isEqual
    ),
    (desc1, desc2) => desc1.languageKey === desc2.languageKey
  ),
  types: filter(
    uniq(flatten(_concat(targetPoi.types, fp.map('types')(pois)))),
    item => !!item
  )
});

export function groupPoisOnSameLocation<POI extends PoiGroupingInputType>(
  minimalDistanceInMeters: number
) {
  return (pois: POI[]): PoiGroupingOutputType[] => {
    let newPois: PoiGroupingOutputType[] = cloneDeep(pois);
    // create poi pairs indexed with their distance
    const indexedPairs = indexPoiPairsByDistance(newPois);
    let pairsCloseToEachOther = filter(
      indexedPairs,
      pair => pair.distance < minimalDistanceInMeters
    );

    const findAndMergeClosePois = () => {
      const targetPoi = pairsCloseToEachOther[0].point1;
      let pickedPois = [targetPoi, pairsCloseToEachOther[0].point2];
      let pickedPairs = [pairsCloseToEachOther[0]];
      const wrapperFn = (points: PoiGroupingOutputType[]) =>
        indexPoiPairsByDistance(points);
      let pairsInRelationWithAPicked: ReturnType<typeof wrapperFn>;

      do {
        pairsInRelationWithAPicked = filter(
          pairsCloseToEachOther,
          pointToCheck =>
            !isEmpty(
              intersection(pickedPois, [
                pointToCheck.point1,
                pointToCheck.point2
              ])
            )
        );

        pickedPairs = uniq(pickedPairs.concat(pairsInRelationWithAPicked));

        pickedPois = pipe(
          pairsInRelationWithAPicked.map(pair => [pair.point1, pair.point2]),
          fp.flatten,
          pickedPois.concat,
          fp.uniq
        );

        pairsCloseToEachOther = pullAll(
          pairsCloseToEachOther,
          pairsInRelationWithAPicked
        );
      } while (!isEmpty(pairsInRelationWithAPicked));

      const poisToMerge = without(pickedPois, targetPoi);

      if (!isEmpty(poisToMerge)) {
        const mergedPoi = mergePois(poisToMerge, targetPoi);
        newPois.push(mergedPoi);
        newPois = pull(newPois, targetPoi);
      }

      newPois = pullAll(newPois, poisToMerge);
    };

    while (!isEmpty(pairsCloseToEachOther)) {
      findAndMergeClosePois();
    }

    return newPois;
  };
}
