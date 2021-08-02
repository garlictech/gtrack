import { TextualDescription } from './interfaces';
import { keys } from 'ts-transformer-keys';
import * as fp from 'lodash/fp';

const fallbackLanguage = 'en_US';

export class MultiLanguageTextFp {
  static selectTextByLanguage(currentLanguage: string) {
    return <T extends TextualDescription>(
      descriptions: T[]
    ): TextualDescription =>
      descriptions.find(item => item.languageKey === currentLanguage) ||
      descriptions.find(item => item.languageKey === fallbackLanguage) ||
      descriptions[0];
  }

  static translatableTagLangKey(): string {
    return 'translatable';
  }

  static createTextualDescription<FROM extends TextualDescription>(
    from: FROM
  ): TextualDescription {
    return fp.pick(keys<TextualDescription>())(from) as TextualDescription;
  }
}
