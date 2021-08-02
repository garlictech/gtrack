import { hikeFixture } from './fixtures';

import { CalculatedHikeFp } from '../calculated-hike';
import * as fp from 'lodash/fp';
import { pipe } from 'fp-ts/lib/function';

describe('Test of CalculatedHike', () => {
  test('Calculate hike from hike data', () => {
    pipe(
      hikeFixture(),
      fp.tap(() => console.time('CALCULATION')),
      CalculatedHikeFp.fromHikeData,
      fp.tap(() => console.timeEnd('CALCULATION')),
      fp.tap(res => expect(res).toMatchSnapshot())
    );
  });

  test('Calculate hike from wrong hike id', () => {
    pipe(
      hikeFixture(),
      data => ({ ...data, id: '' }),
      CalculatedHikeFp.fromHikeData,
      fp.tap(res => expect(res).toMatchSnapshot())
    );
  });

  test('Calculate hike from wrong hike data', () => {
    pipe(
      undefined,
      CalculatedHikeFp.fromHikeData,
      fp.tap(res => expect(res).toMatchSnapshot())
    );
  });
});
