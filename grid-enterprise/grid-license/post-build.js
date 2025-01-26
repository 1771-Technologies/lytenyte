import { copyFileSync, readFileSync, writeFileSync } from "fs";

const file = readFileSync("./dist/index.js", "utf8");
const newContents = file.replace(
  "globalThis.ISSUE_DATE",
  `new Date("${new Date().toISOString().split("T")[0]}")`,
);
const finalContents = newContents.replace(' ?? /* @__PURE__ */ new Date("2023-03-01")', "");

writeFileSync("./dist/index.js", finalContents);

copyFileSync("./dist/index.js", "../../packages/lytenyte-grid-react-enterprise/src/license.js");
