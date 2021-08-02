# gtrack

## Pre-requistes

```
npm i yarn commitizen @angular/cli -g
```

Configuration:

```
git config merge.renameLimit 999999
git config diff.renameLimit 999999
```

We utilize the [Nx monorepos](https://nx.dev/angular): the project structure, usage, everything is that of Nx.

For example, to start the web site:

```
yarn nx serve website
```

(prefix all the nx commands with yarn!). Check the `scripts` section of
`package.json` for all the scripts.

## Commits

In the commits, we use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) so that the release system decides the version number by parsing the commits. You must install commitizen globally:

`npm i commitizen -g`

## Unit and integration tests

Integration tests: anything in `test/integration` directories.

- Execute the unit tests: `yarn unittest`. It skips the integration tests
- Execute all the tests: `yarn test`. It also creates coverage report.

So, to execute an angular test in lib, for example:

```
yarn jest -c ./packages/website/jest.config.js packages/lib/angular/shared/reverse-geocoding/test/integration/reverse-geocoding.spec.ts
```

## Cypress tests

We use cucumber to write tests. The common step definition files are in `<root>/cypress/common`!

## Known problms

---

`Cannot read property 'flags' of undefined`

Caused by `@angular-builders/custom-webpack`, Update the versions in `yarn.lock`:

```
"@angular-builders/custom-webpack@^9.0.0":
  version "9.0.0"
  resolved "https://registry.yarnpkg.com/@angular-builders/custom-webpack/-/custom-webpack-9.0.0.tgz#210ffd3a8faa93551ed63c04d48b3a03d67f770a"
  integrity sha512-L69pCiYGG3NGX0yLi5P88Nw8Nm9jg8RiurwrAzcf9WBKIloHJtFDZJdznrncL+baB++mAcpahIZGz9WGOH9ByQ==
  dependencies:
    "@angular-devkit/architect" "^0.901.0"
    "@angular-devkit/build-angular" "^0.901.0"
    "@angular-devkit/core" "^9.0.0"
    lodash "^4.17.10"
    ts-node "^8.5.2"
    webpack-merge "^4.2.1"
```

Then:

## `yarn install --frozen-lockfile`

```
xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance
```

https://github.com/nodejs/node-gyp/issues/569
