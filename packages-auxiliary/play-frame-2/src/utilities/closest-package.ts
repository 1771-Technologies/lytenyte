import fs from "node:fs";
import path from "node:path";

/**
 * Returns the path to the nearest directory (starting from `cwd`)
 * that contains a package.json file. If none is found, returns null.
 */
export function findNearestPackageJsonDir(cwd: string): string | null {
  let currentDir = path.resolve(cwd);

  // Safety: avoid infinite loops on unusual file systems
  const { root } = path.parse(currentDir);

  while (true) {
    const pkgPath = path.join(currentDir, "package.json");

    if (fs.existsSync(pkgPath) && fs.statSync(pkgPath).isFile()) {
      return currentDir;
    }

    if (currentDir === root) {
      // Reached filesystem root without finding package.json
      return null;
    }

    // Move one level up
    currentDir = path.dirname(currentDir);
  }
}
