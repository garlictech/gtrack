import { routeSegmentData } from './test/fixtures';
import { tap } from 'rxjs/operators';

import { validateCoordinatesWithElevation } from '../../graphql-api';

describe('Test route segment library', () => {
  test('Validate a valid route segment coordinate array', done => {
    validateCoordinatesWithElevation(routeSegmentData())
      .pipe(tap(result => expect(result).toMatchSnapshot()))
      .subscribe(() => done());
  });
});
