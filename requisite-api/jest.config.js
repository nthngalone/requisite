module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['./src/**/*.ts', '!./src/supertest.*.ts'],
    coverageReporters: [ 'text', 'html', 'lcov', 'json'],
    // coverageThreshold: {
    //     global: {
    //         branches: 85,
    //         functions: 90,
    //         lines: 90,
    //         statements: 90
    //     }
    // },
    testPathIgnorePatterns: ['dist']
};
