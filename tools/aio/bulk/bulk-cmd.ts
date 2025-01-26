import { Command } from "commander";
import path from "path";
import fs from "fs/promises";
import fg from "fast-glob";
import { getAioConfig } from "./get-aio-config";
import { getProjectRoot } from "./get-project-root";
import { TopologicalSort } from "topological-sort";
import { getPackageJson, type PackageJson } from "../build-cmd/vite.config";

export const bulkCmd = new Command("bulk").description("Bulk Commands").action(async () => {
  const aioConfig = getAioConfig();
  const root = getProjectRoot();

  const files = fg
    .globSync(
      aioConfig.packages.map((c) => `${c}/package.json`),
      { ignore: ["**/node_modules/**"], cwd: root },
    )
    .map((f) => path.resolve(root, f));

  const map = new Map<string, [PackageJson, string]>();

  for (const file of files) {
    const pkgJson = getPackageJson(file);
    map.set(pkgJson.name, [pkgJson, file]);
  }
  const sortOp = new TopologicalSort(map);

  for (const [pkg] of map.values()) {
    const deps = pkg.dependencies ?? {};
    const names = Object.keys(deps).filter((dep) => {
      return aioConfig.packagePrefixes.some((prefix) => dep.startsWith(prefix));
    });

    for (const dep of names) {
      sortOp.addEdge(pkg.name, dep);
    }
  }

  const order = [...sortOp.sort().values()].reverse();

  for (const node of order) {
    const packageName = node.node[0].name;

    console.log(`Checking: ${packageName}`);

    const proc = Bun.spawn(["aio", "check"], {
      stdio: ["inherit", "inherit", "inherit"],
      cwd: node.node[1].replace("package.json", ""),
    });

    await proc.exited;

    if (proc.exitCode !== 0) {
      console.log("FAILED\n\n", node.node[1]);
      break;
    }
  }

  for (const node of order) {
    const packageName = node.node[0].name;
    console.log(`Building: ${packageName}`);

    const proc = Bun.spawn(["aio", "build"], {
      stdio: ["inherit", "inherit", "inherit"],
      cwd: node.node[1].replace("package.json", ""),
    });

    await proc.exited;

    if (proc.exitCode !== 0) {
      console.log("FAILED to build: \n\n", node.node[1]);
      break;
    }
  }

  for (const node of order) {
    await applyPublishConfig(node.node[1]);
  }
});

async function applyPublishConfig(packageJsonPath: string) {
  try {
    const packageJsonContent = await fs.readFile(packageJsonPath, "utf-8");
    const packageJson = JSON.parse(packageJsonContent);

    // Check if publishConfig exists
    if (!packageJson.publishConfig) {
      console.log("No publishConfig found in package.json");
      return;
    }

    // Create a backup of the original package.json
    const backupPath = path.resolve(process.cwd(), "package.json.backup");
    await fs.writeFile(backupPath, packageJsonContent);
    console.log("Created backup at package.json.backup");

    // Apply publishConfig properties to the root level
    const { publishConfig, ...restPackageJson } = packageJson;
    const updatedPackageJson = {
      ...restPackageJson,
      ...publishConfig,
    };

    // Write the updated package.json
    await fs.writeFile(packageJsonPath, JSON.stringify(updatedPackageJson, null, 2) + "\n");

    console.log("Successfully applied publishConfig to package.json");
    console.log("The following properties were updated:", Object.keys(publishConfig).join(", "));
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
