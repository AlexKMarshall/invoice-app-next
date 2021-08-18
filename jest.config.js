module.exports = {
  setupFilesAfterEnv: ['./jest.setup.js'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  testRegex: '.test.(ts|tsx)$',
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
