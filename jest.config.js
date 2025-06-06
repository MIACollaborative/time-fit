// jest.config.js
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  // Look for tests in all `packages` and `apps` directories
  // disable to work on GitBash
  //testMatch: [
  //  '<rootDir>/packages/**/?(*.)+(spec|test).[jt]s',
  //  '<rootDir>/apps/**/?(*.)+(spec|test).[jt]s'
  //],
  // Required for ESM support
  // https://jestjs.io/docs/ecmascript-modules
  //extensionsToTreatAsEsm: ['.js'],
  transform: {}, // Disable babel-jest or other transformations if you're using native ESM
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    // This is crucial for Jest to resolve your monorepo packages
    // when running from the root.
    '^@time-fit/(.*)$': '<rootDir>/packages/$1/index.js',
  },
};

export default config;