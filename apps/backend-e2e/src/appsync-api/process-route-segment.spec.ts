import { ProcessRouteSegmentService } from '../../process-route-segment.service';
import { NestFactory } from '@nestjs/core';
import { routeSegmentData } from './fixtures';

import { ProcessRouteSegmentModule } from '../../process-route-segment.module';

describe('Test route segment processing', () => {
  let service: ProcessRouteSegmentService;

  beforeAll(async () => {
    const app = await NestFactory.createApplicationContext(
      ProcessRouteSegmentModule
    );
    service = app.get(ProcessRouteSegmentService);
  });

  test('Process an ordinary route segment', done => {
    service.process(routeSegmentData()).subscribe(() => done());
  }, 120000);
});
