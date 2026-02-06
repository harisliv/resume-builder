export const baseRules = {
  'function-paren-newline': 0,
  'import/no-cycle': 2,
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
      paths: [
        {
          name: '@/components',
          message: 'No root barrel. Use module index or direct file.'
        },
        {
          name: '@/components/ui',
          message: 'No UI barrels. Import specific files.'
        },
        {
          name: '@/ui',
          message: 'No UI barrels. Import specific files.'
        },
        {
          name: '@/providers',
          message: 'No providers barrel. Use direct file paths.'
        },
        {
          name: '@/hooks',
          message: 'No hooks barrel. Use direct file paths.'
        },
        {
          name: '@/types',
          message: 'No types barrel. Use direct file paths.'
        },
        {
          name: '@/lib/ResumePDF',
          message: 'No ResumePDF barrel. Use direct file paths.'
        }
      ]
    }
  ]
};
