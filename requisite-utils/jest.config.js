module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['./lib/**/*.ts'],
    coverageReporters: [ 'text', 'html', 'lcov', 'json'],
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 95,
            lines: 95,
            statements: 95
        }
    },
    testPathIgnorePatterns: ['dist']
};
