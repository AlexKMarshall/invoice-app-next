module.exports = {
  setupFilesAfterEnv: ['./jest.client.setup.js'],
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testMatch: [
    '<rootDir>/src/client/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/test/page-tests/**/*.test.{js,jsx,ts,tsx}',
    '!<rootDir>/src/test/page-tests/api/**/*.test.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    '<rootDir>/src/client/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/pages/**/*.*',
    '!<rootDir>/src/pages/api/**/*.*',
    '!<rootDir>/src/**/*.{spec,test,stories}.{js,tsx}',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules',
    '<rootDir>/.next',
    '<rootDir>/src/client/test',
  ],
  coverageDirectory: './coverage/client',
}
