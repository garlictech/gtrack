import { GtrackDefaults } from '@bit/garlictech.universal.gtrack.defaults/defaults';
import {
  distanceFromRoute,
  distanceOnLine,
} from '@bit/garlictech.universal.gtrack.geometry';
import { Poi } from '@bit/garlictech.universal.gtrack.graphql-api';
import {
  IconDescriptor,
  PoiIconsFp,
} from '@bit/garlictech.universal.gtrack.poi-icons';
import { Route } from '@bit/garlictech.universal.gtrack.route';
import { sequenceS } from 'fp-ts/lib/Apply';
import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import * as fp from 'lodash/fp';
import { MultiLanguageTextFp } from '@gtrack/shared/localization/utils';

export interface HikeStop {
  poi: Poi;
  hikeId: string;
  onRoute: boolean;
  offRoute: boolean;
  inBigBuffer: boolean;
  distanceFromStart: number;
  distanceFromRoute: number;
}

type TitleListType = { title: string; icons: IconDescriptor[] };
type TypeDetailType = { translatedType: string; icon: IconDescriptor };

export interface HikeStopSetDetails {
  typeDetails: TypeDetailType[];
  titleList: TitleListType[];
}

export type Translator = {
  translate(word: string): string;
};

export class HikeStopFp {
  static create(poi: Poi, route: Route, hikeId: string): HikeStop {
    const _distanceFromRoute = distanceFromRoute(poi, route.track);
    const _inBigBuffer =
      _distanceFromRoute <= GtrackDefaults.bigRouteBufferSize();
    const _onRoute =
      _distanceFromRoute <= GtrackDefaults.smallRouteBufferSize();

    return {
      poi,
      distanceFromRoute: _distanceFromRoute,
      distanceFromStart: distanceOnLine(route.startPoint, poi, route.track),
      onRoute: _distanceFromRoute <= GtrackDefaults.smallRouteBufferSize(),
      inBigBuffer: _inBigBuffer,
      offRoute: _inBigBuffer && !_onRoute,
      hikeId,
    };
  }

  static getTypeDetailsOfStops = (stops: HikeStop[]) => (
    translator: Translator
  ): O.Option<Array<{ translatedType: string; icon: IconDescriptor }>> =>
    pipe(
      stops,
      fp.map((stop: HikeStop) => stop.poi?.types),
      fp.flatten,
      fp.remove(fp.isNil),
      fp.sortBy(fp.identity),
      fp.sortedUniq,
      fp.map((iconTag: string) =>
        pipe(
          {
            translatedType: pipe(
              `iconTags.${iconTag}`,
              translator.translate,
              O.fromNullable
            ),
            icon: PoiIconsFp.getIcon(iconTag),
          },
          sequenceS(O.option)
        )
      ),
      A.array.sequence(O.option)
    );

  static getTitleListOfStops = (translator: Translator) => (
    currentLanguage: string
  ) => (stops: HikeStop[]): TitleListType[] =>
    pipe(
      stops.map(stop =>
        pipe(
          {
            title: pipe(
              stop.poi.description,
              MultiLanguageTextFp.selectTextByLanguage(currentLanguage),
              desc => desc.title,
              O.fromNullable,
              x => x
            ),
            icons: pipe(
              HikeStopFp.getTypeDetailsOfStops([stop])(translator),
              O.map(fp.map((typeDetail: TypeDetailType) => typeDetail.icon))
            ),
          },
          sequenceS(O.option)
        )
      ),
      fp.filter(O.isSome),
      fp.map(detail => detail.value),
      fp.uniq
    );

  static getDetailsOfStops = (currentLanguage: string) => (
    translator: Translator
  ) => (stops: HikeStop[]): O.Option<HikeStopSetDetails> =>
    pipe(
      HikeStopFp.getTypeDetailsOfStops(stops)(translator),
      O.map(typeDetails => ({
        typeDetails,
        titleList: HikeStopFp.getTitleListOfStops(translator)(currentLanguage)(
          stops
        ),
      }))
    );
}
