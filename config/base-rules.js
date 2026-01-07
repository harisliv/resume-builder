export const baseRules = {
  'function-paren-newline': 0,
  'operator-linebreak': 0,
  'comma-dangle': 1,
  'no-shadow': 0,
  'max-len': 0,
  'object-curly-newline': 0,
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
  'require-yield': 0,
  'no-restricted-imports': [
    'error',
    {
      name: 'xxxx',
      message: 'xxxxxx'
    }
  ]
};
