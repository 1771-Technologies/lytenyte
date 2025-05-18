import { findRootSync } from "@manypkg/find-root";

export function getProjectRoot() {
  return findRootSync(process.cwd()).rootDir;
}
