import { TextualDescription } from '@bit/garlictech.universal.gtrack.graphql-api';
import { filter, flow, isEmpty, map, negate, uniq } from 'lodash/fp';

function collectProperties(
  data: Record<string, unknown>[],
  propertyName: string
) {
  return flow(map(propertyName), filter(negate(isEmpty)), uniq)(data);
}

export function collectUrls<DATA extends { url?: string }>(
  data: DATA[]
): string[] {
  return collectProperties(data, 'url');
}

export function collectSourceTypes<DATA extends { objectType: any }>(
  data: DATA[]
): string[] {
  return collectProperties(data, 'objectType');
}

export function collectLanguageKeys(data: TextualDescription[]): string[] {
  return collectProperties(
    (data as unknown) as Record<string, unknown>[],
    'languageKey'
  );
}

export function collectTitles(data: TextualDescription[]): string[] {
  return collectProperties(
    (data as unknown) as Record<string, unknown>[],
    'title'
  );
}
