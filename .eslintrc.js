module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:@dp-vue/base',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  plugins: [
    '@dp-vue',
  ],
  rules: {
    'consistent-return': 'off',
    'func-names': 'off',
    'import/extensions': 'off',
    'import/prefer-default-export': 'off',
    'max-len': 'off',
    'no-new': 'off',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'vue/prop-name-casing': 'off',
    'vue/sort-keys': ['error', 'asc', {
      natural: true,
    }],
  },
};
