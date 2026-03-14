import { readFileSync } from "fs";
import { createRequire } from "module";
import { resolve, join } from "path";
import { pathToFileURL } from "url";

export async function importVitest(cwd) {
  const req = createRequire(pathToFileURL(join(cwd, "package.json")).href);
  const vitestPkgPath = req.resolve("vitest/package.json");
  const vitestPkg = JSON.parse(readFileSync(vitestPkgPath, "utf-8"));

  const nodeExport = vitestPkg.exports["./node"];
  let entryRelative;
  if (typeof nodeExport === "string") {
    entryRelative = nodeExport;
  } else {
    const imp = nodeExport?.import ?? nodeExport?.default ?? nodeExport;
    entryRelative = typeof imp === "string" ? imp : (imp?.default ?? imp);
  }

  const vitestDir = resolve(vitestPkgPath, "..");
  const entryPath = resolve(vitestDir, entryRelative.replace(/^\.\//, ""));
  return import(pathToFileURL(entryPath).href);
}
