module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${__dirname}/../../../../tools/test/jest/mocks/fileMock.js`,
    '\\.(css|less)$': `${__dirname}/../../../../tools/test/jest/mocks/styleMock.js`,
  },
  transform: {
    '^.+\\.(ts|html)$': 'ts-jest',
    '^.+\\.(js)$': `${__dirname}/../../../../tools/test/jest/jest.transform.js`,
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules//(?!@ngrx|@ionic-native|@ionic|@bit|joi)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/artifacts/', '<rootDir>/.git/'],

  displayName: 'shared-localization-feature-ionic',
  preset: '../../../../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        before: [
          'jest-preset-angular/build/InlineFilesTransformer',
          'jest-preset-angular/build/StripStylesTransformer',
        ],
      },
    },
  },
  coverageDirectory:
    '../../../../coverage/libs/shared/localization/feature-ionic',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
