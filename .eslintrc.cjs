module.exports = {
  extends: ["airbnb-base", "airbnb-typescript/base", "prettier"],
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    sourceType: "module",
    project: "./tsconfig.eslint.json",
    ecmaVersion: "latest",
  },
  overrides: [
    {
      files: [".eslintrc.cjs", "vite.config.ts"],
      rules: {
        "import/no-extraneous-dependencies": "off",
      },
    },
    {
      files: ["src/**/*.ts"],
      rules: {
        "@typescript-eslint/naming-convention": "off",
      },
    },
    {
      files: ["src/styles/*.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "warn",
      },
    },
  ],
};
