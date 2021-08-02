import ImapClient from 'emailjs-imap-client';
import { get as _get } from 'lodash';
import * as nodemailer from 'nodemailer';

export const getRandomString = (): string =>
  Math.random().toString(36).substring(2, 15);

export const getLatestMail = async (user, password) => {
  let res;
  const config = {
    imap: {
      user,
      password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
    },
  };
  const client = new ImapClient(config.imap.host, config.imap.port, {
    auth: {
      user,
      pass: password,
    },
    logLevel: 'info', // 'debug'
    useSecureTransport: config.imap.tls,
  });

  await client
    .connect()
    .then(() => client.search('INBOX', { unseen: true }, { byUid: true }))
    .then(result =>
      client.listMessages(
        'INBOX',
        `${result[0]}`,
        ['uid', 'flags', 'body.peek[text]'],
        {
          byUid: true,
        }
      )
    )
    .then(messages => {
      const content = _get(messages[0], 'body[text]').trim();
      res = content;
      return messages[0];
    })
    .then(message =>
      client.setFlags(
        'INBOX',
        `${message.uid}`,
        { set: ['\\Seen'] },
        { byUid: true }
      )
    )
    .then(() => client.close());

  return res;
};

export const sendTestMail = (user, pass, text, done) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });

  transporter.sendMail(
    {
      from: user,
      to: user,
      subject: 'Test',
      text,
    },
    done
  );
};
