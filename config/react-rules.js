import reactHooks from 'eslint-plugin-react-hooks';

export const reactRules = {
  ...reactHooks.configs.recommended.rules,
  'react-refresh/only-export-components': [
    'warn',
    { allowConstantExport: true }
  ],
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
  'react/no-unstable-nested-components': [2, { allowAsProps: true }]
};
