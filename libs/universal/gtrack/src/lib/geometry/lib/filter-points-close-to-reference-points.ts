import * as fp from 'lodash/fp';
import { approximateDistance } from './geospatial-calculations';

export function filterPointsCloseToReferencePoints<
  POINT1 extends { lat: number; lon: number },
  POINT2 extends { lat: number; lon: number }
>(
  minimalDistance: number,
  referencePoints: POINT1[],
  pointsToFilter: POINT2[]
): POINT2[] {
  let pointsNotYetFiltered = fp.cloneDeep(pointsToFilter);
  let filteredPoints: POINT2[] = [];

  fp.each((referencePoint: POINT1) => {
    filteredPoints = fp.flow(
      fp.filter(
        (point: POINT2) =>
          approximateDistance(referencePoint, point) < minimalDistance
      ),
      fp.concat(filteredPoints)
    )(pointsNotYetFiltered);

    pointsNotYetFiltered = fp.pullAll(filteredPoints)(pointsNotYetFiltered);
  })(referencePoints);

  return filteredPoints;
}
