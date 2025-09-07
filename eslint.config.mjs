import config from "@1771technologies/eslint-preset";
import importPlugin from "eslint-plugin-import";

const finalConfig = [...config];

const imports = {
  files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
  ignores: ["**/node_modules/**/*", "**/dist/**/*", "**/coverage/**/*"],
  rules: {
    "import/extensions": ["error", "always"],
  },
};

finalConfig.push(importPlugin.flatConfigs.typescript, imports);
export default finalConfig;
