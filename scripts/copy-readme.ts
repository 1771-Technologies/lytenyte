import fs from "fs/promises";

const readme = await fs.readFile("./README.md", "utf-8");

const shared = "./packages/lytenyte-shared/README.md";
const core = "./packages/lytenyte-core/README.md";
const pro = "./packages/commercial-lytenyte-pro/README.md";
const dom = "./packages/dom-utils/README.md";
const jsUtils = "./packages/js-utils/README.md";
const react = "./packages/react-components/README.md";
const dragon = "./packages/react-dragon/README.md";
const reactHooks = "./packages/react-hooks/README.md";

const files = [shared, core, pro, dom, jsUtils, react, dragon, reactHooks];

for (const file of files) {
  await fs.writeFile(file, readme);
}
