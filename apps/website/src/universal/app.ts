/* eslint no-console: "off" */
/* eslint-disable @typescript-eslint/no-explicit-any */
// These are important and needed before anything else
import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';

import 'localstorage-polyfill';

const DIST_FOLDER = join(process.cwd());

// Add domino
const template = readFileSync(
  join(DIST_FOLDER, 'browser', 'index.html')
).toString();

// eslint:disable-next-line: no-var-requires
import * as domino from 'domino';
const win: any = domino.createWindow(template);

win.devicePixelRatio = 1;

interface Global extends NodeJS.Global {
  window: any;
  document: any;
  localStorage: any;
  DOMTokenList: any;
  Node: any;
  Text: any;
  HTMLElement: any;
  Element: any;
  navigator: any;
  Event: any;
  KeyboardEvent: any;
  MouseEvent: any;
  URL: any;
  L: any;
}

declare let global: Global;

global.window = win;
global.document = win.document;
global.localStorage = localStorage;
global.DOMTokenList = win.DOMTokenList;
global.Node = win.Node;
global.Text = win.Text;
global.HTMLElement = win.HTMLElement;
global.Element = win.Element;
global.navigator = win.navigator;
global.Event = win.Event;
global.KeyboardEvent = win.KeyboardEvent;
global.MouseEvent = win.MouseEvent;
global.URL = win.URL;

win.localStorage = localStorage;

// eslint:disable-next-line:no-var-requires no-require-imports
win.L = require('leaflet');

global.L = win.L;

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

const PORT = process.env.PORT || 4000;

//app.engine(
//  'html',
//  ngExpressEngine({
//    bootstrap: AppServ,
//    providers: [provideModuleMap(LAZY_MODULE_MAP)],
//  })
//);

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'browser'));

// TODO: implement data requests securely
app.get('/api/*', (_req, res) => {
  res.status(404).send('data requests are not supported');
});

// Server static files from /browser
app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

if (process.env.IS_LAMBDA !== 'true') {
  // Start up the Node server
  app.listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`);
  });
}

export { app };
