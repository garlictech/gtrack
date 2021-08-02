import { buildRetryLogic } from '@bit/garlictech.universal.gtrack.fp';
import { validateSchema } from '@bit/garlictech.universal.gtrack.joi-validator';
import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import * as _ from 'lodash';
import * as fp from 'lodash/fp';
import { Injectable } from '@nestjs/common';
import * as Joi from 'joi';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { HttpClient } from '@bit/garlictech.nestjs.shared.http';
import { LanguageFp } from '@bit/garlictech.universal.gtrack.language';
import {
  PoiSource,
  BoundingBox,
  TextualDescriptionType
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { OsmPoiTypes, ExternalPoi } from './lib/types';

interface OsmPoiResponse {
  tags: {
    name: string;
    amenity: string;
    url?: string;
    description?: string;
    alt_name?: string;
  };
  id: number;
  lat: number;
  lon: number;
  type: string;
}

const responseSchema = Joi.array().items(
  Joi.object()
    .keys({
      id: Joi.number().required(),
      lat: Joi.number().required(),
      lon: Joi.number().required(),
      type: Joi.string().required(),
      tags: Joi.object()
        .keys({
          name: Joi.string(),
          amenity: Joi.string(),
          url: Joi.string().uri(),
          description: Joi.string(),
          alt_name: Joi.string()
        })
        .unknown()
    })
    .unknown()
);

const { validate: validateResponse } = validateSchema<OsmPoiResponse[]>(
  responseSchema
);

const osmTypeMap = {
  natural: PoiSource.osmnatural,
  amenity: PoiSource.osmamenity,
  public_transport: PoiSource.osmpublictransport,
  emergency: PoiSource.osmemergency,
  historic: PoiSource.osmhistoric,
  leisure: PoiSource.osmleisure,
  man_made: PoiSource.osmmanmade,
  military: PoiSource.osmmilitary,
  shop: PoiSource.osmshop,
  tourism: PoiSource.osmtourism
};

@Injectable()
export class OsmPoiService {
  constructor(private readonly _http: HttpClient) {}

  get(
    bounds: BoundingBox,
    typeParam: OsmPoiTypes,
    lng = 'en'
  ): Observable<ExternalPoi[]> {
    Logger.info(
      // eslint-disable-next-line prefer-rest-params
      `OSM poi fetch started with params ${JSON.stringify(arguments, null, 2)}`
    );
    const languageKey = LanguageFp.shortToLocale(lng);

    const request = `
      <osm-script output="json" timeout="25">
        <union into="_">
          <query into="_" type="node">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
          </query>
          <query into="_" type="way">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
          </query>
          <query into="_" type="relation">
            <has-kv k="${typeParam}" modv="" v=""/>
            <bbox-query e="${bounds.NorthEast.lon}" into="_" n="${bounds.NorthEast.lat}" s="${bounds.SouthWest.lat}" w="${bounds.SouthWest.lon}"/>
          </query>
        </union>
        <print e="" from="_" geometry="skeleton" limit="" mode="body" n="" order="id" s="" w=""/>
        <recurse from="_" into="_" type="down"/>
        <print e="" from="_" geometry="skeleton" limit="" mode="skeleton" n="" order="quadtile" s="" w=""/>
      </osm-script>`;

    return this._http
      .post('https://overpass-api.de/api/interpreter', request)
      .pipe(
        buildRetryLogic<unknown>({ logger: Logger }),
        map((response: unknown) => _.get(response, 'elements', [])),
        map(response =>
          fp.filter(
            (_point: OsmPoiResponse) =>
              _.isObject(_point) &&
              _point.type === 'node' &&
              isFinite(_point.lat) &&
              _.isObject(_point.tags)
          )(response)
        ),
        switchMap(response => validateResponse(response)),
        map((response: OsmPoiResponse[]) =>
          fp.flow(
            fp.map((_point: OsmPoiResponse) => {
              const type = _.get(_point.tags, typeParam);

              const sourceObject = [
                {
                  objectType: osmTypeMap[typeParam],
                  languageKey,
                  objectId: _point.id.toString()
                }
              ];

              return {
                lat: _point.lat,
                lon: _point.lon,
                types: [`${typeParam}:${type}`],
                description: [
                  {
                    languageKey,
                    title: _point.tags.name,
                    type: TextualDescriptionType.markdown
                  }
                ],
                sourceObject
              } as ExternalPoi;
            })
          )(response)
        ),
        take(1),
        catchError(err => {
          Logger.error(`Error in OSM POI fetch`);
          Logger.debug(err);
          return of([]);
        })
      );
  }
}
