module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 2,
    '@typescript-eslint/explicit-function-return-type': 1,
    'import/no-cycle': 0,
    'no-param-reassign': ['error', { props: false }],
  },
};
