import { globSync } from "fast-glob";
import { copySync, ensureDirSync, removeSync } from "fs-extra";

const demoFiles = new Set(
  [...globSync("./content/docs/**/demos/**/demo.tsx")].map((c) => {
    return c.split("/").slice(0, -1).join("/");
  }),
);

removeSync(`examples`);

demoFiles.forEach((c) => {
  const dir = c.replace("content/docs/", "").replace("demos/", "");
  ensureDirSync(`examples/${dir}`);

  copySync("./project-template", `examples/${dir}`);
  copySync(`${c}`, `examples/${dir}/src`);
});
