import * as fp from 'lodash/fp';
import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import { buildRetryLogic } from '@bit/garlictech.universal.gtrack.fp';
import { EMPTY, Observable } from 'rxjs';
import { concatMap, delay, expand, map, toArray } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { HttpClient } from '@bit/garlictech.nestjs.shared.http';
import {
  BoundingBox,
  PoiSource,
  CreateImageInput,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import { PoiSearchOutputType } from './lib/types';

const createImageObject = (data: any): CreateImageInput => ({
  lat: data.latitude,
  lon: data.longitude,
  sourceObject: {
    objectType: PoiSource.flickr,
    objectId: data.id,
  },
  original: {
    // DOCS: https://www.flickr.com/services/api/misc.urls.html
    url: data.url_o || data.url_k || data.url_h,
    width: data.width_o || data.width_k || data.width_h,
  },
  card: {
    url: data.url_z,
    width: parseInt(data.width_z, 10) || GtrackDefaults.cardImageWidthInPixel(),
  },
  thumbnail: {
    url: data.url_n,
    width: parseInt(data.width_n, 10) || GtrackDefaults.thumbnailWidthInPixel(),
  },
});

@Injectable()
export class FlickrService {
  apiKey = process.env.FLICKR_API_KEY || '';

  constructor(private readonly _http: HttpClient) {}

  get(bounds: BoundingBox): Observable<PoiSearchOutputType> {
    // eslint-disable-next-line prefer-rest-params
    Logger.info(
      `Flickr poi fetch started with params ${JSON.stringify(bounds, null, 2)}`
    );

    const url = 'https://api.flickr.com/services/rest/';

    const getPage = (page: number) =>
      fp.flow(
        () => ({
          params: {
            method: 'flickr.photos.search',
            api_key: this.apiKey,
            bbox: `${bounds.SouthWest.lon},${bounds.SouthWest.lat},${bounds.NorthEast.lon},${bounds.NorthEast.lat}`,
            privacy_filter: '1',
            content_type: '1',
            extras: 'geo,description,license,url_n,url_z,url_o,url_k,url_h',
            format: 'json',
            nojsoncallback: '1',
            cahcheBreaker: fp.uniqueId(Math.random().toString()),
          },
        }),
        httpQueryParams => ({
          params: page
            ? { ...httpQueryParams.params, page: page.toString() }
            : httpQueryParams.params,
        }),
        httpQueryParams =>
          this._http.get(url, httpQueryParams).pipe(
            delay(2000),
            map((data: any) => ({
              items: fp.flow(
                fp.get('photos.photo'),
                fp.map(createImageObject)
              )(data),
              pageToken:
                data.photos.page < data.photos.pages ? page + 1 : undefined,
            }))
          )
      )();

    return getPage(1).pipe(
      expand(({ pageToken }) => (pageToken ? getPage(pageToken) : EMPTY)),
      concatMap(({ items }) => items as CreateImageInput[]),
      toArray(),
      buildRetryLogic<PoiSearchOutputType>({ logger: Logger })
    );
  }
}
