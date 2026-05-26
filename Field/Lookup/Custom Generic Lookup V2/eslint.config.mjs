import eslintjs from "@eslint/js";
import microsoftPowerApps from "@microsoft/eslint-plugin-power-apps";
import pluginPromise from "eslint-plugin-promise";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["**/generated/"],
  },
  eslintjs.configs.recommended,
  pluginPromise.configs["flat/recommended"],
  microsoftPowerApps.configs.paCheckerHosted,
  {
    plugins: {
      "@microsoft/power-apps": microsoftPowerApps,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ComponentFramework: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": ["off"],
      "@typescript-eslint/prefer-as-const": ["off"],
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-this-alias" : "off",
      "@typescript-eslint/prefer-for-of" : "off",
      "@typescript-eslint/no-namespace" : "off",
      "@typescript-eslint/no-array-constructor" : "off",
      "@typescript-eslint/ban-ts-comment" : "off",
      "@typescript-eslint/consistent-indexed-object-style" : "off",
      "no-prototype-builtins" : "off",
      "promise/always-return" : "off"
    },
  },
];
