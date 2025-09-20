import eslint from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import { findRootSync } from "@manypkg/find-root";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";

const rootPkg = findRootSync(import.meta.dirname).rootDir.replace("package.json", "");

export default defineConfig(
  globalIgnores(["./**/dist/**/*"]),
  {
    extends: [eslint.configs.recommended, tseslint.configs.recommended, globalIgnores(["dist"])],
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    ignores: ["**/node_modules/**/*", "**/dist/**/*", "**/coverage/**/*"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: rootPkg,
      },
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  importPlugin.flatConfigs.typescript,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    ignores: ["**/node_modules/**/*", "**/dist/**/*", "**/coverage/**/*"],
    rules: {
      "import/extensions": ["error", "ignorePackages"],
    },
  },
  {
    ignores: ["**/node_modules/**/*", "**/dist/**/*", "**/coverage/**/*"],
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [reactHooks.configs["recommended-latest"], reactRefresh.configs.vite],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/unsupported-syntax": "off",
    },
  },
);
