import {
  Circle,
  getCenterRadiusOfBox,
  splitBoundingBox,
} from '@bit/garlictech.universal.gtrack.geometry';
import * as _ from 'lodash';
import * as fp from 'lodash/fp';
import { forkJoin, from, interval, Observable, of } from 'rxjs';
import { combineAll, map, switchMap, take } from 'rxjs/operators';
import { Injectable } from '@nestjs/common';
import { HttpClient } from '@bit/garlictech.nestjs.shared.http';
import {
  BoundingBox,
  PoiSource,
  TextualDescriptionType,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { LanguageFp } from '@bit/garlictech.universal.gtrack.language';
import { pipe as fptsPipe } from 'fp-ts/lib/function';
import { map as fptsMap, isSome, Option } from 'fp-ts/lib/Option';
import { Logger } from '@bit/garlictech.nodejs.shared.bunyan-logger';
import { ExternalPoi } from './lib/types';
import { buildRetryLogic } from '@bit/garlictech.universal.gtrack.fp';

@Injectable()
export class WikipediaPoiService {
  constructor(private readonly _http: HttpClient) {}

  getAll(
    bounds: BoundingBox,
    languageCodesShort: string[]
  ): Observable<ExternalPoi[]> {
    // eslint-disable-next-line prefer-rest-params
    Logger.info(
      `Wikipedia poi fetch started with params ${JSON.stringify(
        [bounds, languageCodesShort],
        null,
        2
      )}`
    );
    const boundsArr: BoundingBox[] = [];
    splitBoundingBox(bounds, 10000, boundsArr);
    const _observables: Observable<ExternalPoi[]>[] = _.flatten(
      languageCodesShort.map(languageCode =>
        boundsArr.map(bound =>
          this.get(bound, languageCodesShort, languageCode)
        )
      )
    );

    return forkJoin(_observables).pipe(
      map(poisArr => _.uniqBy(_.flatten(poisArr), 'id'))
    );
  }

  private get(
    bounds: BoundingBox,
    languageCodesShort: string[],
    lng: string
  ): Observable<ExternalPoi[]> {
    const resultOption: Option<Observable<ExternalPoi[]>> = fptsPipe(
      getCenterRadiusOfBox(bounds),
      fptsMap((circle: Circle) => {
        const gsLimit = 500;
        const languageKey = LanguageFp.shortToLocale(lng);
        const radius = Math.floor(circle.radius);

        // eslint:disable:max-line-length
        const request = `https://${lng}.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=${radius}&gscoord=${circle.center.lat}%7C${circle.center.lon}&format=json&gslimit=${gsLimit}&origin=*`;

        // Get basic poi list
        return this._http.get(request).pipe(
          map((data: any) =>
            _.get(data, 'query.geosearch', []).map(
              (_point: {
                pageid: { toString: () => any };
                lat: any;
                lon: any;
                title: any;
              }) => {
                const sourceObject = [
                  {
                    objectType: PoiSource.wikipedia,
                    languageKey,
                    objectId: _point.pageid.toString(),
                    url: `https://${lng}.wikipedia.org/?curid=${_point.pageid}`,
                  },
                ];

                return {
                  lat: _point.lat,
                  lon: _point.lon,
                  types: ['generic:sight'],
                  description: [
                    {
                      languageKey,
                      title: _point.title,
                      type: TextualDescriptionType.html,
                    },
                  ],
                  sourceObject,
                };
              }
            )
          ),
          switchMap((pois: ExternalPoi[]) =>
            this._getPoiDetails(pois, languageCodesShort)
          ),
          take(1),
          buildRetryLogic({ logger: Logger })
        );
      })
    );
    return isSome(resultOption) ? resultOption.value : of([]);
  }

  private _getPoiDetails(
    pois: ExternalPoi[],
    languageCodesShort: string[]
  ): Observable<ExternalPoi[]> {
    const promises: Promise<ExternalPoi[]>[] = [];

    for (const lng of languageCodesShort) {
      const langPois = _.filter(
        pois,
        p => p.description[0].languageKey === LanguageFp.shortToLocale(lng)
      );

      promises.push(this._getPageExtracts(langPois, lng));
      // promises.push(this._getPageImages(langPois, lng));
    }

    return from(Promise.all(promises).then(() => pois));
  }

  /**
   * get submethod - load wikipedia lead sections
   */
  private async _getPageExtracts(
    _pois: ExternalPoi[],
    lng: string
  ): Promise<ExternalPoi[]> {
    const _poiIds = _pois.map((p: ExternalPoi) => p.sourceObject[0].objectId);
    const _chunks = _.chunk(_poiIds, 20);

    return interval(100)
      .pipe(
        take(_chunks.length),
        map(async counter => {
          const _ids = _chunks[counter];
          // eslint:disable:max-line-length
          const request = `https://${lng}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&exlimit=max&pageids=${_ids.join(
            '|'
          )}&origin=*`;
          // tslint:enable:max-line-length

          return this._http
            .get(request)
            .toPromise()
            .then((data: any) => {
              for (const idx in data.query.pages) {
                if (data.query.pages[idx]) {
                  const _exData = data.query.pages[idx];

                  if (_exData.extract) {
                    const _targetPoi = _pois.find(p =>
                      fp.isEqual(
                        p.sourceObject[0].objectId,
                        _exData.pageid.toString()
                      )
                    );

                    if (_targetPoi) {
                      _targetPoi.description[0].summary = _exData.extract;
                    }
                  }
                }
              }

              return of(counter);
            });
        }),
        combineAll()
      )
      .toPromise()
      .then(() => _pois);
  }
}
