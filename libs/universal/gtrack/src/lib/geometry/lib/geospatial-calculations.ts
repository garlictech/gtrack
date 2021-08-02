import { degreesToRadians } from '@turf/helpers';

const EARTH_RADIUS_IN_METERS = 6371000;

/** The equirectangular distance approximation, only for small distances! */
export function approximateDistance<
  POINT1 extends { lon: number; lat: number },
  POINT2 extends { lon: number; lat: number }
>(point1: POINT1, point2: POINT2): number {
  const [lon1, lon2, lat1, lat2] = [
    point1.lon,
    point2.lon,
    point1.lat,
    point2.lat,
  ].map(degree => degreesToRadians(degree));

  const x = (lon2 - lon1) * Math.cos((lat2 + lat1) / 2);
  const y = lat2 - lat1;
  return Math.sqrt(x * x + y * y) * EARTH_RADIUS_IN_METERS;
}
