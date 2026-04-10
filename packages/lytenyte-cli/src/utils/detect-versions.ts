import process from "node:process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { getPackages } from "@manypkg/get-packages";
import { AI_CONFIGS, type AIType } from "../types/index.js";

export const PACKAGES = {
  core: "@1771technologies/lytenyte-core",
  pro: "@1771technologies/lytenyte-pro",
} as const;

export const MIN_VERSION = "2.0.4-dev.3";

export interface DetectedVersion {
  version: string;
  type: "core" | "pro";
  packageName: string;
  packageDir: string;
}

function readPackageJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, "utf-8"));
}

export function hasPackageJson(cwd: string): boolean {
  return findClosestPackageJson(cwd) !== null;
}

function findClosestPackageJson(from: string): string | null {
  let dir = resolve(from);
  while (true) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) return pkgPath;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function hasDependency(packageJson: Record<string, unknown>, dep: string): boolean {
  const deps = packageJson.dependencies as Record<string, string> | undefined;
  const devDeps = packageJson.devDependencies as Record<string, string> | undefined;
  return !!(deps?.[dep] || devDeps?.[dep]);
}

function getInstalledVersion(packageDir: string, dep: string): string | null {
  // Walk up from packageDir looking for the installed package in node_modules
  let dir = resolve(packageDir);
  while (true) {
    const installedPkgPath = join(dir, "node_modules", dep, "package.json");
    if (existsSync(installedPkgPath)) {
      const pkgJson = readPackageJson(installedPkgPath);
      return (pkgJson.version as string) ?? null;
    }
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function getInstalledPackageDir(packageDir: string, dep: string): string | null {
  let dir = resolve(packageDir);
  while (true) {
    const candidate = join(dir, "node_modules", dep);
    if (existsSync(join(candidate, "package.json"))) return candidate;
    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

function extractVersions(
  packageJson: Record<string, unknown>,
  packageName: string,
  packageDir: string,
): DetectedVersion[] {
  const detected: DetectedVersion[] = [];

  for (const [type, dep] of Object.entries(PACKAGES) as ["core" | "pro", string][]) {
    if (!hasDependency(packageJson, dep)) continue;

    const version = getInstalledVersion(packageDir, dep);
    if (!version) continue;

    detected.push({ version, type, packageName, packageDir });
  }

  return detected;
}

export interface MonorepoInfo {
  packages: { name: string; dir: string }[];
  rootDir: string;
  isAtRoot: boolean;
}

export async function getMonorepoInfo(cwd: string): Promise<MonorepoInfo | null> {
  const closestPkgPath = findClosestPackageJson(cwd);
  if (!closestPkgPath) return null;

  const closestDir = dirname(closestPkgPath);

  try {
    const { packages, rootDir } = await getPackages(closestDir);
    const isAtRoot = resolve(closestDir) === resolve(rootDir);
    return {
      packages: packages.map((pkg) => ({
        name: pkg.packageJson.name ?? "unknown",
        dir: pkg.dir,
      })),
      rootDir,
      isAtRoot,
    };
  } catch {
    return null;
  }
}

export function detectPackageManager(cwd: string): "pnpm" | "yarn" | "npm" {
  let dir = resolve(cwd);
  while (true) {
    if (existsSync(join(dir, "pnpm-lock.yaml"))) return "pnpm";
    if (existsSync(join(dir, "yarn.lock"))) return "yarn";
    if (existsSync(join(dir, "package-lock.json"))) return "npm";
    const parent = dirname(dir);
    if (parent === dir) return "npm";
    dir = parent;
  }
}

export async function fetchLatestVersion(packageName: string): Promise<string> {
  const envVersion = process.env.SKILLS_VERSION;
  if (envVersion) return envVersion;

  try {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (!response.ok) {
      throw new Error(`Registry returned ${response.status}`);
    }
    const data = (await response.json()) as { "dist-tags": { latest: string } };
    return data["dist-tags"].latest;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Failed to fetch latest version of ${packageName} from npm registry: ${msg}`);
  }
}

export function findInstalled(cwd: string): Exclude<AIType, "all">[] {
  const allTypes = Object.keys(AI_CONFIGS) as Exclude<AIType, "all">[];
  return allTypes.filter((key) => {
    const skillsDir = join(cwd, AI_CONFIGS[key].skillsPath, "lytenyte-skills");
    return existsSync(skillsDir);
  });
}

export async function detectVersions(cwd: string): Promise<DetectedVersion[]> {
  // Find the closest package.json to the cwd
  const closestPkgPath = findClosestPackageJson(cwd);
  if (!closestPkgPath) return [];

  const closestDir = dirname(closestPkgPath);

  try {
    // Try to resolve as a monorepo
    const { packages, rootDir } = await getPackages(closestDir);
    const isAtRoot = resolve(closestDir) === resolve(rootDir);

    if (isAtRoot) {
      // At the root — check root and all child packages
      const detected: DetectedVersion[] = [];
      for (const pkg of packages) {
        detected.push(
          ...extractVersions(
            pkg.packageJson as unknown as Record<string, unknown>,
            pkg.packageJson.name ?? "unknown",
            pkg.dir,
          ),
        );
      }
      return detected;
    } else {
      // In a child package — only check this package
      const packageJson = readPackageJson(closestPkgPath);
      const name = (packageJson.name as string) ?? "unknown";
      return extractVersions(packageJson, name, closestDir);
    }
  } catch {
    // Not a monorepo — check the closest package.json only
    const packageJson = readPackageJson(closestPkgPath);
    const name = (packageJson.name as string) ?? "unknown";
    return extractVersions(packageJson, name, closestDir);
  }
}
