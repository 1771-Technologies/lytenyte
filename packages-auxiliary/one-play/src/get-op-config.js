import { findRootSync } from "@manypkg/find-root";
import toml from "toml";
import { readFileSync } from "fs";

export function getOpConfig() {
  const root = findRootSync(process.cwd());

  const configFile = `${root.rootDir}/op.config.toml`;

  const contents = readFileSync(configFile, "utf-8");

  const config = toml.parse(contents);

  return config;
}
