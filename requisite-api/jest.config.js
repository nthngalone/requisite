module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*.ts', '!./src/supertest.*.ts'],
    coverageReporters: [ 'text', 'html', 'lcov', 'json'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 85,
            lines: 85,
            statements: 85
        }
    },
    testPathIgnorePatterns: ['dist']
};
