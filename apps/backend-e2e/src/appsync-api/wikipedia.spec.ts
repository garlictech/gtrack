import { NestFactory } from '@nestjs/core';
import { WikipediaPoiService } from '../../wikipedia-poi.service';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { tap } from 'rxjs/operators';
import { AppModule } from '../../../gtrack-api/modules/app.module';

describe('Wikipedia poi integration tests', () => {
  let wikipediaService: WikipediaPoiService;
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

  const languages = ['hu'];

  beforeAll(async () => {
    const app = await NestFactory.createApplicationContext(AppModule);
    wikipediaService = app.get(WikipediaPoiService);
  });

  test('it must download a wikipedia POI', done => {
    wikipediaService
      .getAll(bounds, languages)
      .pipe(tap(result => expect(result).toMatchSnapshot()))
      .subscribe(
        () => done(),
        err => done.fail(err)
      );
  });
});
