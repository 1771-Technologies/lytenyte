#!/usr/bin/env node
import { program } from "commander";
import { init } from "./init/init.js";
import { astro } from "./astro/astro.js";
import { story } from "./story/story-cmd.js";
import { test } from "./test/vitest.js";
import { compileCmd } from "./compile/compile.js";
import { typecheck } from "./typecheck/typecheck-cmd.js";
import { lintCmd } from "./lint/lint-cmd.js";
import { fmtCmd } from "./fmt/fmt.js";
import { createCmd } from "./create/create-cmd.js";
import { npCmd } from "./np/np-cmd.js";
import { changeCmd } from "./change/change.js";
import { codecovCmd } from "./codecov-badge/codecov-badge.js";
import { findNearestPackageJson } from "./get-nearest-package-json.js";
import { $ } from "execa";

program
  .name("One Play")
  .version("0.0.1", "--opv")
  .description("The all in one tool for maintaining TypeScript Mono Repos");

program
  .allowExcessArguments()
  .allowUnknownOption()
  .action(async () => {
    const args = process.argv.slice(2);

    const pkgPath = findNearestPackageJson(process.cwd());
    if (pkgPath == null) {
      console.error("No package.json is present in the current folder.");
      process.exitCode = 1;
      return;
    }

    try {
      await $({
        cwd: pkgPath.replace("package.json", ""),
        stdio: "inherit",
      })`pnpm ${args}`;
    } catch (e) {
      console.error(e.message);
      process.exitCode = 1;
    }
  });

program.addCommand(init);
program.addCommand(astro);
program.addCommand(story);
program.addCommand(test);
program.addCommand(compileCmd);
program.addCommand(typecheck);
program.addCommand(lintCmd);
program.addCommand(fmtCmd);
program.addCommand(createCmd);
program.addCommand(npCmd);
program.addCommand(changeCmd);
program.addCommand(codecovCmd);

program.parse();
