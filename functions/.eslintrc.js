module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "object-curly-spacing": ["error", "always"],
    "@typescript-eslint/no-var-requires": 0,
    "max-len": ["error", { code: 140 }],
    "semi": [2, "always"],
    "quotes": ["error", "double"],
    "import/no-unresolved": 0,
    "indent": "off",
    "linebreak-style": 0,
    "new-cap": 0,
    "require-jsdoc": 0,
  },
};
