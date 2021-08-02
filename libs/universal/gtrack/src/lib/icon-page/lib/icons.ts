import { SupportedTags } from '@bit/garlictech.universal.gtrack.poi-icons/lib/supported-tags';
import * as fp from 'lodash/fp';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import {
  IconDescriptor,
  PoiIconsFp,
} from '@bit/garlictech.universal.gtrack.poi-icons';
import * as A from 'fp-ts/lib/Array';
import { sequenceS } from 'fp-ts/lib/Apply';

export type Translator = {
  translate(word: string): string;
};

export type IconDetails = {
  translatedType: string;
  knownIcon: boolean;
  icon: IconDescriptor;
  iconTag: string;
};

export class Icons {
  static getDetailsOfTags = (tags: SupportedTags) => (
    translator: Translator
  ): O.Option<IconDetails[]> =>
    pipe(
      tags,
      fp.keys,
      fp.map(key => tags[key].map((element: string) => `${key}:${element}`)),
      fp.flatten,
      fp.map((iconTag: string) =>
        pipe(
          {
            translatedType: pipe(
              `iconTags.${iconTag}`,
              translator.translate,
              O.fromNullable
            ),
            icon: PoiIconsFp.getIcon(iconTag),
            knownIcon: O.some(PoiIconsFp.isKnownIconTag(iconTag)),
            iconTag: O.some(iconTag),
          },
          sequenceS(O.option)
        )
      ),
      A.array.sequence(O.option)
    );
}
