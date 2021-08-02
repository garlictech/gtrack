import { graphqlApiSchema } from './graphql-api-schema';

describe('graphqlApiSchema', () => {
  it('should work', () => {
    expect(graphqlApiSchema()).toEqual('graphql-api-schema');
  });
});
