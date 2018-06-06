module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prefer-destructuring': 'off',
    'no-underscore-dangle': 'off',
    'no-param-reassign': ['error', { 'props': false }],
    'no-plusplus': 'off',
    'no-mixed-operators': 'off',
    'no-use-before-define': 'off',
    'arrow-body-style': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
