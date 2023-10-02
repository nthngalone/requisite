export default {
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
    testPathIgnorePatterns: ['dist'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            // override tsconfig to turn off verbatimModuleSyntax just for jest runs
            // can't figure out how to get ts-jest to run esm modules otherwise and tired
            // of fighting with it
            { tsconfig: './tsconfig-jest.json' }
        ],
    }
};
