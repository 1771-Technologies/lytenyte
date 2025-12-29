import path from "path";
import fs from "fs";

export function findNearestPackageJson(startPath) {
  // Resolve the absolute path if a relative path is provided
  const absolutePath = path.resolve(startPath);

  // Get the directory if the path is a file
  let currentDir = fs.statSync(absolutePath).isDirectory()
    ? absolutePath
    : path.dirname(absolutePath);

  // Keep track of the last directory to detect when we've reached the root
  let lastDir = null;

  // Traverse up the directory tree
  while (currentDir !== lastDir) {
    const packagePath = path.join(currentDir, "package.json");

    // Check if package.json exists in the current directory
    if (fs.existsSync(packagePath)) {
      return packagePath;
    }

    // Move up to the parent directory
    lastDir = currentDir;
    currentDir = path.dirname(currentDir);
  }

  // No package.json found
  return null;
}
