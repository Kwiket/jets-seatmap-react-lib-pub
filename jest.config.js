module.exports = {
  displayName: 'jest',
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  coverageThreshold: {
    global: {
      lines: 0,
    },
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
  modulePaths: ['<rootDir>/src'],
  reporters: [
    'default',
  ],
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/scripts/setupJestTests.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testPathIgnorePatterns: ['.+\\.pact\\.test\\.ts$'],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/jest-config/babelTransform.js',
    '^.+\\.css$': '<rootDir>/jest-config/cssTransform.js',
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)':
      '<rootDir>/jest-config/fileTransform.js',
  }
}
