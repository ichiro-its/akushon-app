module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["airbnb", "eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    camelcase: "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
  },
};
