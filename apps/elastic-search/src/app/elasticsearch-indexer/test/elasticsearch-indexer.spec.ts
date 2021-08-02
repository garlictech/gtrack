import { eventFixture } from './fixtures';
import { createDbObjects } from '../lib/elasticsearch-indexer.fp';

test('It must extract the deletable objects', () => {
  expect(createDbObjects(eventFixture())).toMatchSnapshot();
});
