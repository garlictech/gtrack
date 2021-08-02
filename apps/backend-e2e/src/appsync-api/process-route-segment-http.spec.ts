import { NestFactory } from '@nestjs/core';
import { routeSegmentData } from './fixtures';
import { tap } from 'rxjs/operators';
import { AmplifyConfigService } from '@bit/garlictech.nestjs.shared.graphql/amplify-config.service';
import { GraphqlModule } from '@bit/garlictech.nestjs.shared.graphql';
import * as rp from 'request-promise';
import { from } from 'rxjs';
import * as fp from 'lodash/fp';

xdescribe('Test route segment processing with http api', () => {
  let configService: AmplifyConfigService;

  beforeAll(async () => {
    const app = await NestFactory.createApplicationContext(GraphqlModule);
    configService = app.get(AmplifyConfigService);
  });

  // Disable it as the lambda cannot finish its processing in time
  xit('Process an ordinary route segment', done => {
    from(
      rp({
        method: 'POST',
        uri:
          fp.get('config.aws_cloud_logic_custom[0].endpoint', configService) +
          '/v1/process-route-segment',
        body: routeSegmentData(),
        json: true,
      })
    )
      .pipe(tap(result => expect(result).toMatchSnapshot()))
      .subscribe(() => done());
  }, 60000);
});
