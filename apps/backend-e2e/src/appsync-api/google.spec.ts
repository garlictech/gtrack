import { NestFactory } from '@nestjs/core';
import { GooglePoiService } from '../../google-poi.service';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { tap } from 'rxjs/operators';
import { AppModule } from '../../../gtrack-api/modules/app.module';

describe('Google poi integration tests', () => {
  let googleService: GooglePoiService;
  const bounds: BoundingBox = {
    NorthEast: {
      lat: 47.49658015250992,
      lon: 18.971370795243043,
    },
    SouthWest: {
      lat: 47.476971654204256,
      lon: 18.94814786498658,
    },
  };

  beforeAll(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    googleService = app.get(GooglePoiService);
  });

  test('it must download some google POIS', done => {
    googleService
      .get(bounds)
      .pipe(
        tap((result: any[]) =>
          expect(result && result.length).toBeGreaterThan(0)
        )
      )
      .subscribe(
        () => done(),
        err => done.fail(err)
      );
  }, 40000);
});
