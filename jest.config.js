module.exports = {
  verbose: true,
  collectCoverage: true,
  modulePathIgnorePatterns: ['<rootDir>/src/test/'],
  coveragePathIgnorePatterns: ['<rootDir>/src/test/'],
  coverageReporters: ['json-summary', 'text', 'lcov'],
}
