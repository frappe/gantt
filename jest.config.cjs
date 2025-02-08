module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.js',
    },
    transform: {
        '^.+\\.js$': ['babel-jest', { configFile: './babel.config.cjs' }]
    },
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
    coverageDirectory: 'coverage',
    transformIgnorePatterns: [
        'node_modules/(?!(module-that-needs-to-be-transformed)/)',
    ],
    moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  };