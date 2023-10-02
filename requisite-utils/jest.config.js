export default {
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
    testPathIgnorePatterns: ['dist'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            // override tsconfig to turn off verbatimModuleSyntax just for jest runs
            // can't figure out how to get ts-jest to run esm modules otherwise and tired
            // of fighting with it
            { tsconfig: './tsconfig-jest.json' }
        ]
    }
};
