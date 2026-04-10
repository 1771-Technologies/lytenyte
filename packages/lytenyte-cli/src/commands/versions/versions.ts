import process from "node:process";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { valid, prerelease, rcompare, gte } from "semver";
import { PACKAGES, MIN_VERSION } from "../../utils/detect-versions.js";
import { heading, error } from "../../utils/ui.js";

function onCancel() {
  console.log(chalk.dim("\n  Cancelled.\n"));
  process.exit(130);
}

const PACKAGE_META = {
  core: { name: PACKAGES.core, label: "Core" },
  pro: { name: PACKAGES.pro, label: "PRO" },
} as const;

type PackageType = keyof typeof PACKAGE_META;

async function fetchVersions(packageName: string): Promise<string[]> {
  const response = await fetch(`https://registry.npmjs.org/${packageName}`);
  if (!response.ok) {
    throw new Error(`Registry returned ${response.status}`);
  }
  const data = (await response.json()) as { versions: Record<string, unknown> };
  return Object.keys(data.versions)
    .filter((v) => {
      const parsed = valid(v);
      return parsed && !prerelease(v) && gte(v, MIN_VERSION);
    })
    .sort(rcompare);
}

async function printVersions(types: PackageType[]) {
  heading("📋 Available Versions");

  const spinner = ora({ text: chalk.dim("Fetching from npm registry…"), indent: 2 }).start();

  try {
    for (const type of types) {
      const pkg = PACKAGE_META[type];
      const versionList = await fetchVersions(pkg.name);
      spinner.stop();

      const badge =
        type === "pro"
          ? chalk.bgMagenta.black.bold(` ${pkg.label} `)
          : chalk.bgCyan.black.bold(` ${pkg.label} `);

      console.log(`  ${badge} ${chalk.bold(pkg.name)} ${chalk.dim(`(${versionList.length} versions)`)}\n`);

      for (let i = 0; i < versionList.length; i++) {
        const v = versionList[i];
        const prefix = i === 0 ? chalk.green("★") : chalk.dim("·");
        const version = i === 0 ? chalk.green.bold(v) + chalk.green(" ← latest") : chalk.dim(v);
        console.log(`  ${prefix} ${version}`);
      }

      console.log("");
    }

    spinner.stop();
  } catch (e) {
    spinner.fail("Failed to fetch versions from npm registry");
    const msg = e instanceof Error ? e.message : String(e);
    console.log(chalk.dim(`  ${msg}\n`));
    process.exitCode = 1;
  }
}

export const versions = new Command("versions")
  .description("List available package versions")
  .argument("[type]", "Package type: core, pro, or all")
  .action(async (type?: string) => {
    if (type) {
      const normalized = type.toLowerCase();
      if (normalized === "all") {
        await printVersions(["core", "pro"]);
      } else if (normalized in PACKAGE_META) {
        await printVersions([normalized as PackageType]);
      } else {
        error(
          `Unknown type: ${type}. Use ${chalk.bold("core")}, ${chalk.bold("pro")}, or ${chalk.bold("all")}.`,
        );
        process.exitCode = 1;
      }
      return;
    }

    heading("📋 Available Versions");
    console.log("");

    const { selected } = await prompts(
      {
        type: "select",
        name: "selected",
        message: chalk.bold("Which versions would you like to see?"),
        choices: [
          { title: `${chalk.cyan("◆")} Core`, description: PACKAGES.core, value: "core" },
          { title: `${chalk.magenta("◆")} PRO`, description: PACKAGES.pro, value: "pro" },
          { title: `${chalk.white("◆")} All`, description: "Show everything", value: "all" },
        ],
      },
      { onCancel },
    );

    if (selected === undefined) return;

    const types: PackageType[] = selected === "all" ? ["core", "pro"] : [selected];
    await printVersions(types);
  });
