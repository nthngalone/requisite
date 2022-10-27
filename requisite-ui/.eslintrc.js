module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@requisite/eslint-config'
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser'
    },
    rules: {
        'vue/html-indent': [
            'error', 4
        ],
        'vue/multi-word-component-names': 'off'
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true
            }
        }
    ]
};
