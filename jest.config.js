module.exports = {
  verbose: true,
  testRegex: '(/__tests__/.*|(\.|/)(test|spec|ispec))\.[jt]sx?$',
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.{js,jsx}', '!**/node_modules/**', '!**/vendor/**'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: -10,
    },
  },
};
