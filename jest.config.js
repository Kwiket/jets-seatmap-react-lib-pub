module.exports = {
  displayName: 'jest',
  collectCoverageFrom: ['src/**/*.js', 'src/**/*.jsx', '!src/components/Demo/**'],
  coverageThreshold: {
    global: {
      lines: 85,
    },
  },
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
  },
  modulePaths: ['<rootDir>/src'],
  reporters: ['default'],
  resetMocks: true,
  restoreMocks: true,
  setupFilesAfterEnv: ['<rootDir>/scripts/setupJestTests.js'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/jest-config/babelTransform.js',
    '^.+\\.css$': '<rootDir>/jest-config/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/jest-config/fileTransform.js',
  },
};
