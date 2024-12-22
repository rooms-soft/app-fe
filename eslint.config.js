// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const importPlugin = require("eslint-plugin-import");

// TODO: need to add rxjs plugin.
// That new stupid version of eslint config
// needs parse options to be set to typescript-eslint/parser
// and im catching really wierd bug on that
module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: { 'import': importPlugin },
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {
          'default': 'array',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          'accessibility': 'explicit',
          'overrides': {
            'accessors': 'no-public',
            'constructors': 'no-public',
            'methods': 'no-public',
            'properties': 'no-public',
            'parameterProperties': 'no-public',
          },
        },
      ],
      'indent': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-misused-new': 'error',
      '@typescript-eslint/member-ordering': 'error',
      'no-empty': 'off',
      'no-empty-function': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-for-in-array': 'error',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': [
        'error', { 'hoist': 'all', },
      ],
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error', { 'allowTernary': true }
      ],
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      'quotes': 'off',
      'semi': 'error',
      'import/no-unresolved': 'off',
      '@typescript-eslint/unified-signatures': 'error',
      'import/order': 'error',
      'import/no-unused-modules': 'error',
      'max-classes-per-file': 'off',
      'no-caller': 'error',
      'no-debugger': 'error',
      'import/no-duplicates': 'error',
      'arrow-body-style': ['warn', 'as-needed'],
      'arrow-parens': ['off', 'always'],
      'brace-style': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'complexity': ['error', 10],
      'constructor-super': 'error',
      'curly': 'error',
      'max-len': 'off',
      'new-parens': 'error',
      'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 2 }],
      'no-bitwise': 'error',
      'dot-notation': 'off',
      'eol-last': 'error',
      'eqeqeq': 'error',
      'guard-for-in': 'error',
      'id-denylist': 'off',
      'id-match': 'off',
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-call-expression': 'warn',
      '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 15 }],
      '@angular-eslint/template/use-track-by-function': 'error',
      '@angular-eslint/template/conditional-complexity': ['error', { maxComplexity: 15 }],
    },
  }
);
