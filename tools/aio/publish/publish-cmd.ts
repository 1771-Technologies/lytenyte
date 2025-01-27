import { Command } from "commander";
import path from "path";
import fs from "fs/promises";
import fg from "fast-glob";
import { TopologicalSort } from "topological-sort";
import { getPackageJson, type PackageJson } from "../build-cmd/vite.config";
import { getProjectRoot } from "../bulk/get-project-root";
import { getAioConfig } from "../bulk/get-aio-config";

export const publishCmd = new Command("publish").description("Bulk Commands").action(async () => {
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
    await applyPublishConfig(node.node[1]);
  }

  for (const node of order) {
    if (node.node[0].name === "root") continue;

    console.log("Publishing", node.node[0].name);
    const res = await publishIfNew(node.node[1]);

    if (!res.success) {
      console.log(res.message);
      console.error(res.error);
      process.exit(1);
    }

    console.log(res.message);
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

type PublishResult = {
  success: boolean;
  message: string;
  error?: Error;
};

/**
 * Attempts to publish a package only if the version doesn't already exist
 * @param options Optional configuration for publishing
 * @returns Promise with the result of the publish attempt
 */
async function publishIfNew(
  pkgPath: string,
  options?: {
    dryRun?: boolean;
  },
): Promise<PublishResult> {
  try {
    // Read package.json from current directory or specified path
    const pkg = JSON.parse(await Bun.file(pkgPath).text());
    const { name, version } = pkg;

    if (!name || !version) {
      throw new Error("Package name and version are required in package.json");
    }

    // Check if package version exists
    const response = await fetch(`https://registry.npmjs.org/${name}/${version}`);

    if (response.status === 404) {
      if (options?.dryRun) {
        return {
          success: true,
          message: `[Dry Run] Would publish ${name}@${version}`,
        };
      }

      // Execute the publish command
      const publish = Bun.spawn(["bun", "publish"], {
        stdout: "pipe",
        stderr: "pipe",
        cwd: pkgPath.replace("package.json", ""),
      });

      const output = await new Response(publish.stdout).text();
      const error = await new Response(publish.stderr).text();

      if (error) {
        throw new Error(error);
      }

      return {
        success: true,
        message: `Successfully published ${name}@${version}\n${output}`,
      };
    }

    return {
      success: true,
      message: `Version ${version} of ${name} already exists`,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to publish package",
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}
