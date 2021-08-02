import { NestFactory } from '@nestjs/core';
import { FlickrService } from '../../flickr.service';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { tap } from 'rxjs/operators';
import { AppModule } from '../../../gtrack-api/modules/app.module';

describe('flickr poi integration tests', () => {
  let flickrService: FlickrService;
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
    flickrService = app.get(FlickrService);
  });

  test('it must download some flickr POIS', done => {
    flickrService
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
  }, 20000);
});
