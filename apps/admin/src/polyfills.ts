/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */

(window as any).global = window;
/***************************************************************************************************
 * APPLICATION IMPORTS
 */

/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */

// import 'core-js/es7/reflect';
import 'hammerjs/hammer';
import 'web-animations-js'; // Run `npm install --save web-animations-js`.
import 'zone.js/dist/zone'; // Included with Angular CLI.

global.Buffer = global.Buffer || require('buffer').Buffer;
// aws-sdk wants it
(window as any).process = { browser: true };
