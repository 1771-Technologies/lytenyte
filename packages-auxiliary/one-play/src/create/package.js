export const pkg = `{
  "name": "[name]",
  "version": "0.0.1",
  "type": "module",
  "files": [
    "dist",
    "LICENSE",
    "README.md"
  ],
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "import": "./src/index.ts",
      "require": "./src/index.ts"
    }
  },
  "publishConfig": {
    "access": "public",
    "exports": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.js"
    }
  }
}`;

export const sitePkg = `{
  "name": "[name]",
  "type": "module",
  "version": "0.0.1",
  "private": true
}`;
