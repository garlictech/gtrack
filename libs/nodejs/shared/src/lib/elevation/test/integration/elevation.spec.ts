import * as E from 'fp-ts/lib/Either';
import * as fp from 'lodash/fp';
import { getElevationOfPoints } from '@bit/garlictech.universal.gtrack.elevation';
import { tap } from 'rxjs/operators';
import { googleElevationService } from '@bit/garlictech.universal.gtrack.google-maps';
import { Client } from '@googlemaps/google-maps-services-js';
import { googleMapsDeps } from '../../../google-maps';
import { pointFixture } from './fixtures';

describe('Elevation service tests', () => {
  it('Get elevation of a point with the google map service', done => {
    googleElevationService(googleMapsDeps)
      .getElevationForLocations([pointFixture])
      .pipe(tap(res => expect(res).toMatchSnapshot()))
      .subscribe(() => done());
  });

  it('Get elevation of a point with the full elevation service', done => {
    getElevationOfPoints([pointFixture])(googleElevationService(googleMapsDeps))
      .pipe(tap(res => expect(res).toMatchSnapshot()))
      .subscribe(() => done());
  });

  it('Test wrong api key data', done => {
    getElevationOfPoints([pointFixture])(
      googleElevationService({
        client: googleMapsDeps.client,
        apiKey: 'foobar',
      })
    )
      .pipe(tap(res => expect(res).toMatchSnapshot()))
      .subscribe(() => done());
  });

  it('Test wrong client response', done => {
    const client = ({
      elevation: jest
        .fn()
        .mockReturnValue(Promise.resolve({ data: { results: [] } })),
    } as unknown) as Client;

    getElevationOfPoints([pointFixture])(
      googleElevationService({ client, apiKey: 'foobar' })
    )
      .pipe(tap(res => expect(res).toMatchSnapshot()))
      .subscribe(() => done());
  });

  it('Test chunked data', done => {
    const fixture = fp.fill(0, 1500, pointFixture, new Array(1500));

    getElevationOfPoints(fixture)(googleElevationService(googleMapsDeps))
      .pipe(
        tap(res =>
          expect(E.isRight(res) && (res as any).right.length).toMatchSnapshot(
            'RESULT LENGTH'
          )
        )
      )
      .pipe(tap(res => expect(res).toMatchSnapshot('RESULT ARRAY')))
      .subscribe(() => done());
  });
});
