import { nodejsShared } from './nodejs-shared';

describe('nodejsShared', () => {
  it('should work', () => {
    expect(nodejsShared()).toEqual('nodejs-shared');
  });
});
