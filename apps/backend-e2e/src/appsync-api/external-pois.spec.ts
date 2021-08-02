import { NestFactory } from '@nestjs/core';
import { ExternalPoiService } from '../../external-poi.service';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { tap } from 'rxjs/operators';
import { AppModule } from '../../../gtrack-api/modules/app.module';

describe('External poi integration tests', () => {
  let externalPoiService: ExternalPoiService;
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
    externalPoiService = app.get(ExternalPoiService);
  });

  test('it must download some externalPoi POIS', done => {
    externalPoiService
      .get(bounds, ['en'], [])
      .pipe(
        tap((result: any[]) =>
          expect(result && result.length).toBeGreaterThan(0)
        )
      )
      .subscribe(
        () => done(),
        err => done.fail(err)
      );
  }, 80000);
});
