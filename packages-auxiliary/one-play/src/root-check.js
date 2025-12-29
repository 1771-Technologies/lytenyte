import { findRootSync } from "@manypkg/find-root";
import { findNearestPackageJson } from "./get-nearest-package-json.js";

export function rootCheck() {
  const pkgPath = findNearestPackageJson(process.cwd());

  if (!pkgPath) {
    console.error("Expected a package json to be present.");
    process.exitCode = 1;
    return;
  }
  const root = findRootSync(process.cwd());

  if (`${root.rootDir}/package.json` === pkgPath) {
    console.error("You can not build the root.");
    process.exitCode = 1;
    return;
  }
}
