import process from "node:process";
import { cpSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { gte } from "semver";
import { AI_CONFIGS, type AIType } from "../../types/index.js";
import {
  detectVersions,
  findInstalled,
  getInstalledPackageDir,
  hasPackageJson,
  PACKAGES,
  MIN_VERSION,
  type DetectedVersion,
} from "../../utils/detect-versions.js";
import { heading, success, warn, error, done, info } from "../../utils/ui.js";

function onCancel() {
  console.log(chalk.dim("\n  Cancelled.\n"));
  process.exit(130);
}

function resolveType(flag: string | undefined): "core" | "pro" | null {
  if (!flag) return null;
  const normalized = flag.toLowerCase();
  if (normalized === "core" || normalized === "pro") return normalized;
  return null;
}

function updateSkillsFolder(cwd: string, aiType: Exclude<AIType, "all">, detected: DetectedVersion): void {
  const config = AI_CONFIGS[aiType];
  const packageName = PACKAGES[detected.type];
  const installedDir = getInstalledPackageDir(detected.packageDir, packageName);

  if (!installedDir) {
    error(`Could not locate ${packageName} in node_modules.`);
    return;
  }

  const sourceSkillsDir = join(installedDir, "skills");

  if (!existsSync(sourceSkillsDir)) {
    error(`No skills folder found in ${packageName}.`);
    return;
  }

  const skillsDir = join(cwd, config.skillsPath, "lytenyte-skills");
  if (existsSync(skillsDir)) rmSync(skillsDir, { recursive: true });
  cpSync(sourceSkillsDir, skillsDir, { recursive: true });

  success(`${config.label} → updated to ${chalk.cyan("v" + detected.version)}`);
}

export const update = new Command("update")
  .description("Update skills to match installed version")
  .option("--ai <type>", "AI assistant type (or 'all')")
  .option("--type <type>", "Package type: core or pro")
  .option("-y, --yes", "Skip all confirmation prompts")
  .action(async (opts: { ai?: string; type?: string; yes?: boolean }) => {
    const cwd = process.cwd();
    const yes = opts.yes ?? false;

    if (opts.type && !resolveType(opts.type)) {
      error(`Unknown package type: ${opts.type}. Use ${chalk.bold("core")} or ${chalk.bold("pro")}.`);
      process.exitCode = 1;
      return;
    }

    heading("🔄 Update Skills");

    if (!hasPackageJson(cwd)) {
      error("No package.json found.");
      console.log(chalk.dim("  Make sure you're in a project with a package.json.\n"));
      process.exitCode = 1;
      return;
    }

    const spinner = ora({ text: chalk.dim("Scanning for dependencies…"), indent: 2 }).start();
    const detected = await detectVersions(cwd);
    spinner.stop();

    if (detected.length === 0) {
      error("No core (react) or PRO (react-dom) dependency found.");
      console.log(chalk.dim("  Make sure you're in a project with react installed.\n"));
      process.exitCode = 1;
      return;
    }

    // Validate versions
    const tooOld = detected.filter((d) => !gte(d.version, MIN_VERSION));
    const validVersions = detected.filter((d) => gte(d.version, MIN_VERSION));

    for (const d of tooOld) {
      warn(
        `${chalk.bold(d.packageName)}: ${PACKAGES[d.type]} v${d.version} is below minimum v${MIN_VERSION}`,
      );
    }

    if (validVersions.length === 0) {
      error(`No dependencies found with version >= ${MIN_VERSION}. Cannot update.`);
      console.log("");
      process.exitCode = 1;
      return;
    }

    // Select package type
    let chosenType: "core" | "pro";

    if (resolveType(opts.type)) {
      chosenType = resolveType(opts.type)!;
    } else if (yes) {
      chosenType = "core";
    } else {
      console.log("");
      const { packageType } = await prompts(
        {
          type: "select",
          name: "packageType",
          message: chalk.bold("Which package do you want to update skills for?"),
          choices: [
            { title: `📦 Core`, description: PACKAGES.core, value: "core" as const },
            { title: `💎 PRO`, description: PACKAGES.pro, value: "pro" as const },
          ],
        },
        { onCancel },
      );

      if (!packageType) return;
      chosenType = packageType as "core" | "pro";
    }

    const matched = validVersions.find((d) => d.type === chosenType) ?? validVersions[0];
    const selected: DetectedVersion = { ...matched, type: chosenType };

    info(
      `Using ${chalk.bold(PACKAGES[chosenType])} ${chalk.cyan("v" + selected.version)} from ${chalk.dim(selected.packageName)}`,
    );

    // Find installed skills
    const installed = findInstalled(cwd);

    if (installed.length === 0) {
      console.log("");
      error("No installed skills found.");
      console.log(chalk.dim("  Run") + chalk.bold(" skills install") + chalk.dim(" first.\n"));
      process.exitCode = 1;
      return;
    }

    let aiTypes: Exclude<AIType, "all">[];

    if (opts.ai) {
      const normalized = opts.ai.toLowerCase() as AIType;
      if (normalized === "all") {
        aiTypes = installed;
      } else if (normalized in AI_CONFIGS) {
        if (!installed.includes(normalized as Exclude<AIType, "all">)) {
          error(`No skills installed for ${AI_CONFIGS[normalized as Exclude<AIType, "all">].label}.`);
          console.log("");
          process.exitCode = 1;
          return;
        }
        aiTypes = [normalized as Exclude<AIType, "all">];
      } else {
        error(`Unknown AI type: ${opts.ai}`);
        console.log("");
        process.exitCode = 1;
        return;
      }
    } else {
      aiTypes = installed;
      info(`Updating: ${chalk.bold(installed.map((i) => AI_CONFIGS[i].label).join(", "))}`);
    }

    heading(`Updating to ${PACKAGES[selected.type]} v${selected.version}`);

    for (const ai of aiTypes) {
      updateSkillsFolder(cwd, ai, selected);
    }

    done();
  });
