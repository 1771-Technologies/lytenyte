import { findUpSync } from "find-up";

export function getClosestNpmPackage(cwd?: string) {
  return findUpSync("package.json", { cwd: cwd ?? process.cwd() });
}
