import { existsSync } from "fs";
import { dirname, basename, join } from "path";

const TEST_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs", ".cts", ".cjs"];

/**
 * Given the absolute path of a .play.* file, returns the absolute paths of all
 * associated test files that exist on disk, plus the play file itself (for
 * in-source tests).
 */
export function resolveTestFiles(playFilePath) {
  const dir = dirname(playFilePath);
  const filename = basename(playFilePath);

  // "button.play.tsx" -> base = "button"
  const match = filename.match(/^(.+?)\.play\.[^.]+$/);
  if (!match) return [playFilePath];

  const base = match[1];
  const found = new Set();

  for (const ext of TEST_EXTENSIONS) {
    // Same dir: button.test.ts / button.test.tsx / etc.
    const sibling = join(dir, `${base}.test${ext}`);
    if (existsSync(sibling)) found.add(sibling);

    // __tests__ subdir: __tests__/button.test.ts
    const inTests = join(dir, "__tests__", `${base}.test${ext}`);
    if (existsSync(inTests)) found.add(inTests);

    // __tests__ subdir without .test suffix: __tests__/button.ts
    const inTestsBare = join(dir, "__tests__", `${base}${ext}`);
    if (existsSync(inTestsBare)) found.add(inTestsBare);
  }

  // Always include the play file itself for in-source tests
  found.add(playFilePath);

  return [...found];
}
