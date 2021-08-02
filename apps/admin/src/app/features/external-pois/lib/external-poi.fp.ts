import {
  CreatePoiInput,
  PoiSource,
  PoiSourceObject,
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { pick } from 'lodash';
import { filter, flow, isEmpty, map, negate, uniq } from 'lodash/fp';
import * as fp from 'lodash/fp';
import { ExternalPoi } from '../interfaces';

export class ExternalPoiFp {
  static collectUrls = (poi: ExternalPoi): string[] =>
    flow(map('url'), filter(negate(isEmpty)))(poi.sourceObject);

  static collectSourceTypes = (poi: ExternalPoi): string[] =>
    flow(map('objectType'), uniq)(poi.sourceObject);

  static collectLanguageKeys = (poi: ExternalPoi): string[] =>
    flow(map('languageKey'), uniq)(poi.description);

  static collectTitles = (poi: ExternalPoi): string[] =>
    map('title')(poi.description);

  static convertToPoiInput = (poi: ExternalPoi): CreatePoiInput => ({
    ...pick(poi, [
      'lat',
      'lon',
      'types',
      'description',
      'sourceObject',
      'address',
      'phoneNumber',
      'openingHours',
      'elevation',
    ]),
    elevation: poi.elevation,
  });

  static idFromSourceObject(objectType: PoiSource, objectId: string): string {
    return `${objectType}_${objectId}`;
  }

  static thumbnailImageWidth(): number {
    return 320;
  }

  static cardImageWidth(): number {
    return 640;
  }

  static collectObjId<
    T extends { sourceObject: PoiSourceObject[] | PoiSourceObject }
  >(pois: T[]): string[] {
    return fp.flow(
      _pois => (fp.isArray(_pois) ? _pois : [_pois]),
      fp.map((x: T) => x.sourceObject),
      fp.flatten,
      fp.map((sourceObject: PoiSourceObject) =>
        ExternalPoiFp.idFromSourceObject(
          sourceObject.objectType,
          sourceObject.objectId
        )
      ),
      fp.uniq
    )(pois);
  }
}
