export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['dist'],
    setupFiles: ['dotenv/config'],
    maxConcurrency: 1
};
