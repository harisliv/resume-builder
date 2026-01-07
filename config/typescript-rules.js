export const typescriptRules = {
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
  '@typescript-eslint/naming-convention': [
    1,
    {
      selector: 'typeLike',
      format: ['PascalCase'],
      custom: {
        regex: '^T[A-Z]',
        match: true
      }
    },
    {
      selector: 'enum',
      format: ['PascalCase'],
      custom: {
        regex: '^E[A-Z]',
        match: true
      }
    },
    {
      selector: 'interface',
      format: ['PascalCase'],
      custom: {
        regex: '^I[A-Z]',
        match: true
      }
    }
  ]
};
