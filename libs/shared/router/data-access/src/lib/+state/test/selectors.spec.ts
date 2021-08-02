import * as fromSelectors from '../selectors';
import { createState } from './utils';

const testCasesWithoutProps = Object.keys(fromSelectors).map(key => ({
  name: key,
  selector: fromSelectors[key],
  state: createState(),
}));

const testCasesWithProps = [
  {
    name: 'selectRouteParam',
    selector: fromSelectors.selectRouteParam,
    state: createState({
      params: { id: 'idParam' },
    }),
    props: 'id',
  },
];

describe('Router selector tests', () => {
  describe('without props', function () {
    testCasesWithoutProps.forEach(({ name, state, selector }) => {
      test(`#${name} should match the snapShot`, () => {
        expect(selector(state)).toMatchSnapshot();
      });
    });
  });

  describe('with props', function () {
    testCasesWithProps.forEach(({ name, state, selector, props }) => {
      test(`#${name} should match the snapShot`, () => {
        expect(selector(state, props)).toMatchSnapshot();
      });
    });
  });
});
