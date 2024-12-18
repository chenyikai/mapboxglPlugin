module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  rules: {
    // 自定义规则
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:prettier/recommended'],
    },
  ],
};
