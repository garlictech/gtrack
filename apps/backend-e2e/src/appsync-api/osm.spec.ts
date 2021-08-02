import { NestFactory } from '@nestjs/core';
import { OsmPoiService } from '../../osm-poi.service';
import { BoundingBox } from '@bit/garlictech.universal.gtrack.graphql-api';
import { tap } from 'rxjs/operators';
import { OsmPoiTypes } from '../../lib/types';
import { AppModule } from '../../../gtrack-api/modules/app.module';

describe('OSM poi integration tests', () => {
  let osmService: OsmPoiService;
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
    osmService = app.get(OsmPoiService);
  });

  test('it must download some osm POIS', done => {
    osmService
      .get(bounds, OsmPoiTypes.amenity)
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
