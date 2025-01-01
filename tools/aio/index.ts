#!/usr/bin/env bun

import { program } from "commander";
import { testCmd } from "./test/test-cmd";
import { playCmd } from "./play/play-cmd";
import { playwrightCmd } from "./playwright/playwright-cmd";

program
  .name("1771 AIO")
  .description(
    "An all in one CLI for building, testing, and maintaining web applications and libraries.",
  )
  .version("0.0.1");

program.addCommand(testCmd);
program.addCommand(playCmd);
program.addCommand(playwrightCmd);

program.parse();
