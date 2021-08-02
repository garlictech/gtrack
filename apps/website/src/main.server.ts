/* eslint-disable @typescript-eslint/no-explicit-any */

import * as domino from 'domino';
import { readFileSync } from 'fs';
import { join } from 'path';

import 'localstorage-polyfill';

const DIST_FOLDER = join(process.cwd());

// Add domino
const template = readFileSync(
  join(DIST_FOLDER, 'browser', 'index.html')
).toString();
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

export { AppServerModule } from './app/app.server.module';
