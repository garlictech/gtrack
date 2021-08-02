import { convertGeojsonPointFeatureToPoint } from './point-transformations';
import { point as turfPoint } from '@turf/helpers';

describe('Test point transformations', () => {
  test('convertGeojsonPointFeatureToPoint', () => {
    const fixture = turfPoint([1, 2, 3]);
    expect(convertGeojsonPointFeatureToPoint(fixture)).toMatchSnapshot();

    const badFixture = turfPoint([1, 2, 3]);
    badFixture.geometry = null;
    expect(convertGeojsonPointFeatureToPoint(badFixture)).toMatchSnapshot();
  });
});
