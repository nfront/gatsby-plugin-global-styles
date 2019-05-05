module.exports = {
  parser: 'babel-eslint',
  extends: [
    // extends add rules, instead of manually adding
    // Lower (bottom) ones overwrite higher (top) ones
    'eslint:recommended',
    'plugin:flowtype/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'airbnb',
    'prettier',
    'react-app',
    'plugin:prettier/recommended'
  ],
  plugins: ['prettier', 'react-hooks', 'jsx-a11y', 'import', 'flowtype', 'jest'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, printWidth: 120, trailingComma: 'es5' }],
    'jsx-a11y/href-no-hash': [0],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/jsx-one-expression-per-line': 'off',
    'react/prop-types': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': [
      'error',
      {
        vars: 'local',
        args: 'none',
      },
    ],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'hrefLeft', 'hrefRight'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],
  },
};
