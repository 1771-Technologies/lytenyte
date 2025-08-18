import fs from "fs/promises";

const readme = await fs.readFile("./README.md", "utf-8");

const shared = "./packages/lytenyte-shared/README.md";
const core = "./packages/lytenyte-core/README.md";
const pro = "./packages/commercial-lytenyte-pro/README.md";
const typegen = "./packages/commercial-lytenyte-type-gen/README.md";
const dom = "./packages/dom-utils/README.md";
const jsUtils = "./packages/js-utils/README.md";
const react = "./packages/react-components/README.md";
const dragon = "./packages/react-dragon/README.md";
const reactHooks = "./packages/react-hooks/README.md";
const forkFloating = "./packages/fork-floating/README.md";
const forkFocus = "./packages/fork-focus/README.md";
const forkFocusTrap = "./packages/fork-focus-trap/README.md";
const forkObjectEquals = "./packages/fork-object-equals/README.md";
const forkReactAutocomplete = "./packages/fork-react-autocomplete/README.md";
const forkScrollLock = "./packages/fork-scroll-lock/README.md";

const files = [
  shared,
  typegen,
  core,
  pro,
  dom,
  jsUtils,
  react,
  dragon,
  reactHooks,
  forkFloating,
  forkFocus,
  forkFocusTrap,
  forkReactAutocomplete,
  forkObjectEquals,
  forkScrollLock,
];

for (const file of files) {
  await fs.writeFile(file, readme);
}
