import {
  Poi,
  PoiSource,
  PoiSourceObject
} from '@bit/garlictech.universal.gtrack.graphql-api';
import { UpdatePoiInput } from '@bit/garlictech.universal.gtrack.graphql-api';
import * as fp from 'lodash/fp';
import * as O from 'fp-ts/lib/Option';

const mapObjectTypeUrl = (objectType: PoiSource): string =>
  objectType === PoiSource.google ? 'website' : objectType;

export class PoiFp {
  static collectUrls(poi: Poi): { urlType: string; url: string }[] {
    return fp.flow(
      fp.filter((obj: PoiSourceObject) => !fp.isEmpty(obj.url)),
      fp.map(({ objectType, url }) => ({
        urlType: mapObjectTypeUrl(objectType),
        url: url as string
      })),
      x => (fp.isArray(x) ? x : [])
    )(poi.sourceObject);
  }

  static bannedTypes(): string[] {
    return ['political'];
  }

  static topInterestTypes(): string[] {
    return [
      'peak',
      'sight',
      'city',
      'archaeological_site',
      '	battlefield',
      'building',
      'castle',
      'castle_wall',
      'church',
      'city_gate',
      'citywalls',
      'farm',
      'fort',
      'gallows',
      'highwater_mark',
      'locomotive',
      'manor',
      'memorial',
      'milestone',
      'monastery',
      'monument',
      'ruins',
      'rune_stone',
      'ship',
      'tomb',
      'tower',
      'wayside_cross',
      'wayside_shrine',
      'wreck',
      'attraction',
      'artwork',
      'viewpoint',
      'natural_reserve'
    ];
  }

  static getMostInterestingPoiType(types: string[]): O.Option<string> {
    return fp.flow(
      () => fp.intersection(PoiFp.topInterestTypes(), types),
      fp.first,
      O.fromNullable
    )();
  }

  static filterTopInterestPois(pois: Poi[]): Poi[] {
    const selectorFv = fp.flow(
      (poi: Poi) => poi.types,
      (types: string[]) => fp.intersection(PoiFp.topInterestTypes(), types),
      fp.negate(fp.isEmpty)
    );

    return fp.filter(selectorFv)(pois);
  }

  static filterSecondaryInterestPois(pois: Poi[]): Poi[] {
    const selectorFv = fp.flow(
      (poi: Poi) => poi.types,
      (types: string[]) => fp.intersection(PoiFp.topInterestTypes(), types),
      fp.isEmpty
    );

    return fp.filter(selectorFv)(pois);
  }

  static createPoiUpdateData(poi: Poi): UpdatePoiInput {
    const removeTypename = fp.map(
      fp.flow(fp.omit(['__typename']), fp.omitBy(fp.isNull))
    );

    return fp.flow(
      fp.omitBy(fp.isNull),
      fp.omit(['__typename', 'lat', 'lon', 'elevation']),
      (updatedPoi: Partial<Poi>) =>
        ({
          ...updatedPoi,
          sourceObject: removeTypename(updatedPoi.sourceObject),
          description: removeTypename(updatedPoi.description)
        } as UpdatePoiInput)
    )(poi);
  }
}

export const getMostInterestingPoiType = fp.flow(
  fp.intersection(PoiFp.topInterestTypes()),
  fp.first,
  O.fromNullable
);
