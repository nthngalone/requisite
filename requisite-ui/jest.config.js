module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.{ts,vue}'],
    coverageReporters: ['html', 'text-summary', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 60,
            function: 55,
            lines: 75,
            statements: 75
        }
    },
    moduleFileExtensions: ['js', 'ts', 'json', 'vue'],
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest',
        '^.+\\.tsx?$': [
            'ts-jest',
            // override tsconfig to turn off verbatimModuleSyntax just for jest runs
            // can't figure out how to get ts-jest to run esm modules otherwise and tired
            // of fighting with it
            { tsconfig: './tsconfig-jest.json' }
        ]
    },
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        customExportConditions: ['node', 'node-addons']
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    clearMocks: true,
    restoreMocks: true,
    resetModules: true
};
