module.exports = {
  setupFilesAfterEnv: ['./jest.server.setup.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testMatch: [
    '<rootDir>/src/server/**/*.test.{js,jsx,ts,tsx}',
    '<rootDir>/src/test/api/**/*.test.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'node',
  collectCoverageFrom: [
    '<rootDir>/src/server/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/pages/api/**/*.*',
    '!<rootDir>/src/**/*.{spec,test,stories}.{js,tsx,ts}',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules', '<rootDir>/.next'],
  coverageDirectory: './coverage/server',
}
