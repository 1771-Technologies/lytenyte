import { existsSync } from "fs";
import { dirname, basename, join } from "path";

const TEST_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mts", ".mjs", ".cts", ".cjs"];

export function resolveTestFiles(playFilePath) {
  const dir = dirname(playFilePath);
  const filename = basename(playFilePath);

  const match = filename.match(/^(.+?)\.play\.[^.]+$/);
  if (!match) return [playFilePath];

  const base = match[1];
  const found = new Set();

  for (const ext of TEST_EXTENSIONS) {
    const sibling = join(dir, `${base}.test${ext}`);
    if (existsSync(sibling)) found.add(sibling);

    const inTests = join(dir, "__tests__", `${base}.test${ext}`);
    if (existsSync(inTests)) found.add(inTests);

    const inTestsBare = join(dir, "__tests__", `${base}${ext}`);
    if (existsSync(inTestsBare)) found.add(inTestsBare);
  }

  found.add(playFilePath);

  return [...found];
}
