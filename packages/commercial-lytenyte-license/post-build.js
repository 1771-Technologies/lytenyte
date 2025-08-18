import { copyFileSync, readFileSync, writeFileSync } from "fs";

const file = readFileSync("./dist/license.js", "utf8");
const newContents = file.replace(
  "globalThis.ISSUE_DATE",
  `new Date("${new Date().toISOString().split("T")[0]}")`,
);
const finalContents = newContents.replace(' ?? /* @__PURE__ */ new Date("2023-03-01")', "");

writeFileSync("./dist/license.js", finalContents);
copyFileSync("./dist/license.js", "../commercial-lytenyte-pro/src/license.js");
