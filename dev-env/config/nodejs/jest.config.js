module.exports = {
  verbose: true,
  bail: true,
  clearMocks: true,
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {},
  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.json`,
      ignoreCoverageForAllDecorators: true,
      babelConfig: `${__dirname}/babel.config.json`,
    },
  },
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
    '^.+\\.(js)$': `${__dirname}/test/jest/jest.transform.js`,
  },
  cacheDirectory: '<rootDir>/artifacts/cache',
  moduleDirectories: ['node_modules'],
  transformIgnorePatterns: ['<rootDir>/node_modules//(?!@bit)'],
  testPathIgnorePatterns: ['/node_modules/', '/artifacts/', '<rootDir>/.git'],
  coverageReporters: ['json', 'lcov', 'text', 'html'],
  testEnvironment: 'node',
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
