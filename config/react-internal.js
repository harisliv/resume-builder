import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import react from 'eslint-plugin-react';

export const config = {
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    react: react
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    '@typescript-eslint/consistent-type-imports': 1,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/comma-dangle': 0,
    '@typescript-eslint/no-unsafe-return': 0,
    '@typescript-eslint/unbound-method': 0,
    '@typescript-eslint/no-unsafe-argument': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-misused-promises': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-explicit-any': 1,
    'function-paren-newline': 0,
    'operator-linebreak': 0,
    'comma-dangle': 1,
    'no-shadow': 0,
    'max-len': 0,
    // indent: [1, 2],
    'object-curly-newline': 0,
    'react/jsx-indent': [2, 2],
    'react/require-default-props': 0,
    'react/jsx-props-no-spreading': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-curly-newline': 0,
    'react/function-component-definition': [
      0,
      {
        namedComponents: 'function-declaration'
      }
    ],
    'react/jsx-filename-extension': [
      2,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ],
    'arrow-body-style': [2, 'as-needed'],
    'class-methods-use-this': 0,
    'import/no-webpack-loader-syntax': 0,
    'newline-per-chained-call': 0,
    'default-param-last': 0,
    'no-confusing-arrow': 0,
    'no-console': 1,
    'no-unused-expressions': [
      2,
      {
        allowShortCircuit: true
      }
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
      },

      {
        selector: 'LabeledStatement',
        message:
          'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
      },
      {
        selector: 'WithStatement',
        message:
          '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
      }
    ],
    'no-use-before-define': 0,
    'prefer-template': 2,
    'react/destructuring-assignment': 0,
    'react/jsx-closing-tag-location': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-no-target-blank': 0,
    'react/jsx-uses-vars': 2,
    'react/jsx-no-duplicate-props': [2, { ignoreCase: false }],
    'react/require-extension': 0,
    'react/self-closing-comp': 0,
    'react/sort-comp': 0,
    'react/state-in-constructor': 0,
    'react/static-property-placement': 0,
    'react/jsx-no-useless-fragment': [
      2,
      {
        allowExpressions: true
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unstable-nested-components': [2, { allowAsProps: true }],
    'require-yield': 0,
    'no-restricted-imports': [
      'error',
      {
        name: 'xxxx',
        message: 'xxxxxx'
      }
    ]
  }
};
