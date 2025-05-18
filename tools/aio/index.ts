#!/usr/bin/env bun

import { program } from "commander";
import { testCmd } from "./test/test-cmd";
import { playCmd } from "./play/play-cmd";
import { playwrightCmd } from "./playwright/playwright-cmd";
import { buildCmd } from "./build-cmd/build-cmd";
import { checkCmd } from "./check/check-cmd";
import { bulkCmd } from "./bulk/bulk-cmd";
import { applyPublishConfigCmd } from "./publish/apply-publish-config";
import { publishCmd } from "./publish/publish-cmd";
import { publishPkgCmd } from "./publish/publish-pkg";

program
  .name("1771 AIO")
  .description(
    "An all in one CLI for building, testing, and maintaining web applications and libraries.",
  )
  .version("0.0.1");

program.addCommand(testCmd);
program.addCommand(playCmd);
program.addCommand(playwrightCmd);
program.addCommand(buildCmd);
program.addCommand(checkCmd);
program.addCommand(bulkCmd);
program.addCommand(publishCmd);
program.addCommand(publishPkgCmd);
program.addCommand(applyPublishConfigCmd);

program.parse();
