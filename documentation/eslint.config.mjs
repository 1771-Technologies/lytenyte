import config from "@1771technologies/eslint-preset";

export default [
  ...config,

  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    rules: {
      "import/extensions": "off",
      "react-refresh/only-export-components": "off",
    },
  },
];
