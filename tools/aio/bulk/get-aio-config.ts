import { readFileSync } from "node:fs";
import { resolve } from "path";
import { exit } from "process";
import { getProjectRoot } from "./get-project-root";

interface AioConfig {
  packagePrefixes: string[];
  packages: string[];
}

export function getAioConfig() {
  const root = getProjectRoot();

  try {
    const configFile = readFileSync(resolve(root, "./aio.config.json"), "utf8");
    const jsonConfig = JSON.parse(configFile) as AioConfig;

    return jsonConfig;
  } catch (error) {
    if ((error as { code: string }).code === "ENOENT") {
      console.error(
        `AIO config file not found. When using AIO, a config fill called "aio.config.json" should be present at the root of the project. The root path was determined to be ${root}`,
      );
      exit(1);
    }
    throw error;
  }
}
