import * as fromActions from '../actions';

describe('Test the router actions', () => {
  it('Replace should handle default parameters', () => {
    const action = new fromActions.Replace(['foo']);
    expect(action.extras).toEqual({ replaceUrl: true });
  });
});
