import * as fp from 'lodash/fp';
import {
  HikeStop,
  HikeStopFp,
} from '@bit/garlictech.universal.gtrack.hike-stops/lib';
import {
  TextualDescriptionType,
  PoiSource,
} from '@bit/garlictech.universal.gtrack.graphql-api';

const hikeStopFixture1 = (): HikeStop => ({
  poi: {
    description: [
      {
        title: 'Title hu',
        type: TextualDescriptionType.markdown,
        languageKey: 'hu',
      },

      {
        title: 'Title en',
        type: TextualDescriptionType.markdown,
        languageKey: 'en',
      },
    ],
    elevation: 352.4300842285156,
    id: '47.831427-19.970145',
    lat: 47.831427,
    lon: 19.970145,
    sourceObject: [
      {
        languageKey: 'en_US',
        objectId: '2462119138',
        objectType: PoiSource.osmamenity,
      },
    ],
    types: ['amenity:restaurant', 'amenity:bar'],
  },
  hikeId: 'HIKEID',
  distanceFromStart: 1,
  distanceFromRoute: 2,
  onRoute: true,
  offRoute: true,
  inBigBuffer: true,
});

const hikeStopFixture2 = (): HikeStop => ({
  poi: {
    description: [
      {
        title: 'Title 2 hu',
        type: TextualDescriptionType.markdown,
        languageKey: 'hu',
      },

      {
        title: 'Title 2 en',
        type: TextualDescriptionType.markdown,
        languageKey: 'en',
      },
    ],
    elevation: 352.4300842285156,
    id: '47.831427-19.970145-2',
    lat: 47.831427,
    lon: 19.970145,
    sourceObject: [
      {
        languageKey: 'en_US',
        objectId: '2462119138',
        objectType: PoiSource.osmamenity,
      },
    ],
    types: ['natural:wood'],
  },
  hikeId: 'HIKEID',
  distanceFromStart: 1,
  distanceFromRoute: 2,
  onRoute: true,
  offRoute: true,
  inBigBuffer: true,
});

const hikeStopFixtureNullTitle = (): HikeStop => ({
  poi: {
    description: [
      {
        type: TextualDescriptionType.markdown,
        languageKey: 'hu',
      },

      {
        type: TextualDescriptionType.markdown,
        languageKey: 'en',
      },
    ],
    elevation: 352.4300842285156,
    id: '47.831427-19.970145-2',
    lat: 47.831427,
    lon: 19.970145,
    sourceObject: [
      {
        languageKey: 'en_US',
        objectId: '2462119138',
        objectType: PoiSource.osmamenity,
      },
    ],
    types: ['natural:wood'],
  },
  hikeId: 'HIKEID',
  distanceFromStart: 1,
  distanceFromRoute: 2,
  onRoute: true,
  offRoute: true,
  inBigBuffer: true,
});

test('getDetailsOfStops the good case', () => {
  const stops = [hikeStopFixture1(), hikeStopFixture2()];
  expect(
    HikeStopFp.getDetailsOfStops('hu')({
      translate: (what: string) => `TRANSLATED-${what}`,
    })(stops)
  ).toMatchSnapshot();
});

test('getDetailsOfStops with some repetitions', () => {
  const fixt1 = hikeStopFixture1();
  const fixt2 = fp.cloneDeep(hikeStopFixture2());
  fixt2.poi.description = fixt1.poi.description;
  fixt2.poi.types = fixt1.poi.types;
  const stops = [fixt1, fixt2];
  expect(
    HikeStopFp.getDetailsOfStops('hu')({
      translate: (what: string) => `TRANSLATED-${what}`,
    })(stops)
  ).toMatchSnapshot();
});

test('getDetailsOfStops with some bad stuff', () => {
  const fixt1 = hikeStopFixture1();
  const fixt2 = fp.cloneDeep(hikeStopFixture2());
  fixt2.poi.types = ['foobar'];
  const stops = [fixt1, fixt2];
  expect(
    HikeStopFp.getDetailsOfStops('hu')({
      translate: (what: string) => `TRANSLATED-${what}`,
    })(stops)
  ).toMatchSnapshot();
});

test('getDetailsOfStops with null titles', () => {
  const stops = [hikeStopFixtureNullTitle()];
  expect(
    HikeStopFp.getDetailsOfStops('hu')({
      translate: (what: string) => `TRANSLATED-${what}`,
    })(stops)
  ).toMatchSnapshot();
});
