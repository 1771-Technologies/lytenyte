import { globSync } from "fast-glob";
import { copySync, ensureDirSync, removeSync } from "fs-extra";

const demoFiles = new Set(
  [...globSync("./docs/**/demos/**/demo.tsx")].map((c) => {
    return c.split("/").slice(0, -1).join("/");
  }),
);

removeSync(`examples`);

demoFiles.forEach((c) => {
  const dir = c.replace("docs/", "").replace("demos/", "");
  ensureDirSync(`examples/${dir}`);

  copySync("./project-template", `examples/docs/${dir}`);
  copySync(`${c}`, `examples/docs/${dir}/src`);
});
