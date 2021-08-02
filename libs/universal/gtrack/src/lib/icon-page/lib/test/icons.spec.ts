import { supportedTags } from '../../../poi-icons';
import { Icons } from '../icons';

const iconTagFixture1 = supportedTags;

test('getDetailsOfTags the good case', () => {
  const tags = iconTagFixture1;
  expect(
    Icons.getDetailsOfTags(tags)({
      translate: (what: string) => `TRANSLATED-${what}`,
    })
  ).toMatchSnapshot();
});
