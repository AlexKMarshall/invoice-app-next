module.exports = {
  // Run type-check on changes to TypeScript files
  '**/*.ts?(x)': () => 'yarn tsc',
  // Run ESLint on changes to JavaScript/TypeScript files
  '**/*.(ts|js)?(x)': (filenames) => `yarn lint --fix ${filenames.join(' ')}`,
  '*': (filenames) => `yarn format --ignore-unknown ${filenames.join(' ')}`,
}
