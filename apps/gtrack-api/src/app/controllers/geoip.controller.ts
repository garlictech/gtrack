import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import { Controller, Get, Req } from '@nestjs/common';
import * as MmdbReader from 'mmdb-reader';
import * as fp from 'lodash/fp';
import { bindNodeCallback, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { get } from 'lodash';

@Controller('geoip')
export class GeoipController {
  @Get()
  public getLocation(@Req() req: Request): Observable<any> {
    const ip = get(req, 'apiGateway.event.requestContext.identity.sourceIp');
    Logger.debug('Lookup for ip: ', ip);

    return bindNodeCallback((callback: any) =>
      // see the lambda webpack config, for the database file path
      MmdbReader.open(`../../assets/GeoLite2-City.mmdb`, callback)
    )().pipe(
      map((reader: any) =>
        fp.flow(
          fp.property('location'),
          ({ accuracy_radius, latitude, longitude }) => ({
            accuracy: accuracy_radius * 1000 /* so in meters... */,
            latitude,
            longitude
          })
        )(reader.lookup(ip))
      )
    );
  }
}
