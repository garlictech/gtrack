import { googleElevationService } from '@bit/garlictech.universal.gtrack.google-maps';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { getElevationOfPoints } from '@bit/garlictech.universal.gtrack.elevation';
import { googleMapsDeps } from '@bit/garlictech.nodejs.shared.google-maps';

export const getElevationOfPointsFromGoogle = <
  POINT extends { lat: number; lon: number }
>(
  points: POINT[]
): OE.ObservableEither<any, POINT[]> =>
  getElevationOfPoints(points)(googleElevationService(googleMapsDeps));
