module.exports = {
    preset: 'ts-jest',
    collectCoverage: true,
    collectCoverageFrom: ['<rootDir>/src/**/*.{ts,vue}'],
    coverageReporters: ['html', 'text-summary', 'lcov'],
    // coverageThreshold: {
    //     global: {
    //         branches: 80,
    //         function: 80,
    //         lines: 80,
    //         statements: 80
    //     }
    // },
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
