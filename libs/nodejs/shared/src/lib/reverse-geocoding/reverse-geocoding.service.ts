import { googleReverseGeocodingService } from '@bit/garlictech.universal.gtrack.google-maps';
import * as OE from 'fp-ts-rxjs/lib/ObservableEither';
import { googleMapsDeps } from '@bit/garlictech.nodejs.shared.google-maps';

export const getCityFromGoogle = <POINT extends { lat: number; lon: number }>(
  point: POINT
): OE.ObservableEither<any, string> =>
  googleReverseGeocodingService(googleMapsDeps).getCity(point);
