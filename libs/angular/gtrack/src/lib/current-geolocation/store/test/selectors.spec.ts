import * as fromSelectors from '../selectors';
import { createState } from './utils';

const testCases = [
  {
    name: 'selectCurrentLocation',
    selector: fromSelectors.selectCurrentLocation,
    state: createState(),
  },
  {
    name: 'selectTracking',
    selector: fromSelectors.selectTracking,
    state: createState(),
  },
];

testCases.forEach(({ name, selector, state }) => {
  test(`${name} with input ${JSON.stringify(state)}`, () => {
    expect(selector(state)).toMatchSnapshot();
  });
});
