import { groupPoisOnSameLocation } from './group-pois-on-same-location';
import { ExternalPoi } from './types';

test('Filter pois on same location', () => {
  const fixture = ([
    {
      id: 1,
      lat: 1,
      lon: 1,
      sourceObject: [
        {
          objectId: 1,
        },
      ],
      types: ['t1'],
      description: {
        languageKey: 'lan1',
        summary: 'summary 1',
      },
    },
    {
      id: 2,
      lat: 1,
      lon: 1,
      types: ['t2.1', 't2.2'],
      sourceObject: [
        {
          objectId: 2,
        },
      ],
      description: {
        languageKey: 'lan1',
        summary: 'summary 2',
      },
    },
    {
      id: 3,
      lat: 2,
      lon: 2,
      sourceObject: [
        {
          objectId: 3,
        },
      ],
      description: {
        languageKey: 'lan3',
        summary: 'summary 3',
      },
    },
    {
      id: 4,
      lat: 1,
      lon: 1,
      sourceObject: [
        {
          objectId: 4,
        },
      ],
      description: {
        languageKey: 'lan4',
        summary: 'summary 4',
      },
    },
  ] as unknown) as ExternalPoi[];

  expect(groupPoisOnSameLocation(50)(fixture)).toMatchSnapshot();
});
