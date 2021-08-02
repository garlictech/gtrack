import { getLatestMail, getRandomString, sendTestMail } from './utils';

xdescribe('Test getting the latest email with imap', () => {
  let config;
  jest.setTimeout(10000);

  beforeAll(done => {
    config = {
      username: 'paycap.test@gmail.com',
      // eslint:disable-next-line: no-hardcoded-credentials
      password: '123456789aA.',
      testText: getRandomString(),
    };
    sendTestMail(config.username, config.password, config.testText, done);
  });

  describe('getLatestMail()', () => {
    it('should get the text of the latest unread email', async () => {
      const text = await getLatestMail(config.username, config.password);
      expect(text).toBe(config.testText);
    });
  });
});
