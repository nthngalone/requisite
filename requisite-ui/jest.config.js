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
    transform: {
        '^.+\\.vue$': '@vue/vue3-jest'
    },
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
    },
    clearMocks: true,
    restoreMocks: true,
    resetModules: true
};
