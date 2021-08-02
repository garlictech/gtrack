import { mapSvgs } from '@bit/garlictech.universal.gtrack.map-symbols/map_symbols';
import { IconDescriptor } from './types';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';

/**
 * Update colors and encode the svg content (if needed)
 */
//const prepareSvg = (
//  content: string,
//  fileId: string,
//  encoded: boolean,
//  iconStyle: EIconStyle
//) => {
//  if (content) {
//    const iconStr = updateColors(content, fileId, iconStyle);
//
//    return encoded ? `data:image/svg+xml;base64,${btoa(iconStr)}` : iconStr;
//  } else {
//    return undefined;
//  }
//};

const splitIconTag = (iconTag: string): O.Option<string[]> =>
  pipe(
    iconTag,
    fp.split(':'),
    O.fromPredicate(tags => tags.length === 2 && !fp.some(fp.isEmpty, tags))
  );

const getIconCategoryAndUrl = (
  iconTag: string
): O.Option<{ url: string; category: string }> =>
  pipe(
    iconTag,
    splitIconTag,
    O.map(([category]) => ({
      url: mapSvgs[iconTag] ? iconTag : 'generic:asterisco',
      category,
    }))
  );

export class PoiIconsFp {
  //static getStyledIcon = (iconStyle: EIconStyle) => (
  static getStyledIcon = () => (type: string): O.Option<IconDescriptor> =>
    PoiIconsFp.getIcon(type);

  static getColoredIcon = (iconTag: string) => (
    color: string
  ): O.Option<IconDescriptor> =>
    pipe(
      getIconCategoryAndUrl(iconTag),
      O.map(({ url }) => ({
        url,
        color,
      }))
    );

  static getStrippedIconName = (iconTag: string): O.Option<string> =>
    pipe(
      iconTag,
      splitIconTag,
      O.map(splitted => splitted[1])
    );

  static getIcon(iconTag: string): O.Option<IconDescriptor> {
    const colorMap: Record<string, string> = {
      natural: '#108E4C',
      amenity: '#265DB2',
      publicTransport: '#9D7050',
      emergency: '#BF3638',
      historic: '#8D4EB8',
      leisure: '#FF8A21',
      manMade: '#C259B5',
      military: '#A8A8A8',
      shop: '#5DC8BD',
      tourism: '#66C547',
      generic: '##FF8C00',
    };

    return pipe(
      getIconCategoryAndUrl(iconTag),
      O.map(({ category, url }) => ({
        url,
        color: colorMap[category] ?? '#ffffff',
      }))
    );
  }

  static getDefaultIconColor = (iconTag: string): O.Option<string> =>
    pipe(
      PoiIconsFp.getIcon(iconTag),
      O.map(icon => icon.color)
    );

  static getIcons(types: string[]): O.Option<IconDescriptor[]> {
    return pipe(types, fp.map(PoiIconsFp.getIcon), A.array.sequence(O.option));
  }

  static isKnownIconTag(iconTag: string): boolean {
    return !fp.isUndefined(mapSvgs[iconTag]);
  }
}
