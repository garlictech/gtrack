module.exports = {
  preset: 'jest-preset-angular',
  verbose: true,
  bail: true,
  clearMocks: true,
  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.json`,
      ignoreCoverageForAllDecorators: true,
      stringifyContentPathRegex: '\\.html$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
    '^.+\\.(js)$': `${__dirname}/test/jest/jest.transform.js`,
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  cacheDirectory: '<rootDir>/artifacts/cache',
  moduleDirectories: ['node_modules'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${__dirname}/test/jest/mocks/fileMock.js`,
    '\\.(css|less)$': `${__dirname}/test/jest/mocks/styleMock.js`,
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules//(?!@ngrx|@ionic-native|@ionic|@bit|joi)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/artifacts/', '<rootDir>/.git/'],
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js',
  ],
  testEnvironment: 'jest-environment-jsdom-thirteen',
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '\\.(e2e|spec|d)\\.ts$',
    '/test/',
    '/mocks/',
    '/jest/',
    'log.ts',
    '/assets/',
  ],
};
