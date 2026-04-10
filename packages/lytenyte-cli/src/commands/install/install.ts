import process from "node:process";
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import { gte } from "semver";
import { AI_CONFIGS, type AIType } from "../../types/index.js";
import { detectAITypes } from "../../utils/detect-ai.js";
import {
  detectVersions,
  detectPackageManager,
  fetchLatestVersion,
  getInstalledPackageDir,
  getMonorepoInfo,
  hasPackageJson,
  PACKAGES,
  MIN_VERSION,
  type DetectedVersion,
} from "../../utils/detect-versions.js";
import { multiselect } from "../../utils/multiselect.js";
import { heading, success, warn, error, done, skip, info } from "../../utils/ui.js";

function onCancel() {
  console.log(chalk.dim("\n  Cancelled.\n"));
  process.exit(130);
}

async function createSkillsFolder(
  cwd: string,
  aiType: Exclude<AIType, "all">,
  detected: DetectedVersion,
  yes: boolean,
): Promise<void> {
  const config = AI_CONFIGS[aiType];
  const skillFile = join(cwd, config.skillsPath, "lytenyte-skills", "SKILL.md");

  if (existsSync(skillFile) && !yes) {
    const { overwrite } = await prompts(
      {
        type: "confirm",
        name: "overwrite",
        message: `${chalk.bold(config.label)} already has skills installed. Overwrite?`,
        initial: false,
      },
      { onCancel },
    );

    if (!overwrite) {
      skip(`${config.label} — existing skills preserved`);
      return;
    }
  }

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
  cpSync(sourceSkillsDir, skillsDir, { recursive: true });

  success(`${config.label} → ${chalk.dim(config.skillsPath + "/lytenyte-skills/SKILL.md")}`);
}

async function selectAI(aiFlag: string | undefined, cwd: string): Promise<Exclude<AIType, "all">[] | null> {
  const allTypes = Object.keys(AI_CONFIGS) as Exclude<AIType, "all">[];

  if (aiFlag) {
    const normalized = aiFlag.toLowerCase() as AIType;
    if (normalized === "all") return allTypes;
    if (normalized in AI_CONFIGS) return [normalized as Exclude<AIType, "all">];
    error(`Unknown AI type: ${aiFlag}`);
    return null;
  }

  // Auto-detect AI types from existing folders
  const detected = new Set(detectAITypes(cwd));

  if (detected.size > 0) {
    info(`Auto-detected: ${chalk.bold([...detected].map((d) => AI_CONFIGS[d].label).join(", "))}`);
    console.log("");
  }

  const selected = await multiselect(
    "Which AI assistants do you want to install skills for?",
    allTypes.map((key) => ({
      label: AI_CONFIGS[key].label,
      value: key,
      selected: detected.has(key),
    })),
  );

  if (!selected) return null;
  return selected as Exclude<AIType, "all">[];
}

function resolveType(flag: string | undefined): "core" | "pro" | null {
  if (!flag) return null;
  const normalized = flag.toLowerCase();
  if (normalized === "core" || normalized === "pro") return normalized;
  return null;
}

export const install = new Command("install")
  .description("Install skills for your AI assistants")
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

    if (yes && !opts.ai) {
      error(`${chalk.bold("--yes")} requires ${chalk.bold("--ai <type>")} to be specified.`);
      process.exitCode = 1;
      return;
    }

    heading("📦 Install Skills");

    if (!hasPackageJson(cwd)) {
      error("No package.json found.");
      console.log(chalk.dim("  Initialize a project first:"));
      console.log(chalk.dim(`    ${chalk.bold("npm init -y")}  or  ${chalk.bold("pnpm init")}\n`));
      process.exitCode = 1;
      return;
    }

    const spinner = ora({ text: chalk.dim("Scanning for dependencies…"), indent: 2 }).start();
    let detected = await detectVersions(cwd);
    spinner.stop();

    // Track the type chosen during fallback install so we don't ask again
    let fallbackChosenType: "core" | "pro" | null = null;

    if (detected.length === 0) {
      warn("No core (react) or PRO (react-dom) dependency found.");
      console.log("");

      let fallbackType: "core" | "pro";

      if (resolveType(opts.type)) {
        fallbackType = resolveType(opts.type)!;
      } else if (yes) {
        fallbackType = "core";
      } else {
        const { packageType } = await prompts(
          {
            type: "select",
            name: "packageType",
            message: chalk.bold("Would you like to install a package?"),
            choices: [
              { title: `📦 Core`, description: PACKAGES.core, value: "core" as const },
              { title: `💎 PRO`, description: PACKAGES.pro, value: "pro" as const },
            ],
          },
          { onCancel },
        );

        if (!packageType) return;
        fallbackType = packageType as "core" | "pro";
      }

      fallbackChosenType = fallbackType;

      const packageName = PACKAGES[fallbackType];
      const latestSpinner = ora({
        text: chalk.dim(`Fetching latest ${packageName} version…`),
        indent: 2,
      }).start();

      let latestVersion: string;
      try {
        latestVersion = await fetchLatestVersion(packageName);
      } catch (e) {
        latestSpinner.fail("Failed to fetch version");
        error(e instanceof Error ? e.message : String(e));
        process.exitCode = 1;
        return;
      }

      latestSpinner.succeed(chalk.dim(`Latest ${packageName} version: ${chalk.cyan("v" + latestVersion)}`));
      console.log("");

      // Determine install targets
      let installDirs: { name: string; dir: string }[];
      const mono = await getMonorepoInfo(cwd);

      if (mono?.isAtRoot && mono.packages.length > 0) {
        if (yes) {
          installDirs = [{ name: basename(cwd), dir: cwd }];
        } else {
          const choices = [
            { label: `${basename(mono.rootDir)} (root)`, value: mono.rootDir },
            ...mono.packages.map((pkg) => ({ label: pkg.name, value: pkg.dir })),
          ];

          const selectedDirs = await multiselect(
            "Which packages should it be installed in?",
            choices.map((c) => ({ label: c.label, value: c.value, selected: false })),
          );

          if (!selectedDirs || selectedDirs.length === 0) return;
          installDirs = selectedDirs.map((dir) => {
            const match = choices.find((c) => c.value === dir);
            return { name: match!.label, dir: dir as string };
          });
        }
      } else {
        installDirs = [{ name: basename(cwd), dir: cwd }];
      }

      const pm = detectPackageManager(cwd);
      const addCmd = pm === "yarn" ? "add" : pm === "pnpm" ? "add" : "install";

      for (const target of installDirs) {
        const installSpinner = ora({
          text: chalk.dim(`Installing ${packageName}@${latestVersion} in ${target.name}…`),
          indent: 2,
        }).start();

        try {
          execSync(`${pm} ${addCmd} ${packageName}@${latestVersion}`, {
            cwd: target.dir,
            stdio: "pipe",
          });
          installSpinner.succeed(
            chalk.dim(`Installed ${packageName}@${latestVersion} in ${chalk.bold(target.name)}`),
          );
        } catch (e) {
          installSpinner.fail(`Failed to install ${packageName} in ${target.name}`);
          const msg = e instanceof Error ? e.message : String(e);
          console.log(chalk.dim(`  ${msg}\n`));
          process.exitCode = 1;
          return;
        }
      }

      console.log("");

      // Re-detect after install
      const redetectSpinner = ora({ text: chalk.dim("Re-scanning dependencies…"), indent: 2 }).start();
      detected = await detectVersions(cwd);
      redetectSpinner.stop();

      if (detected.length === 0) {
        error("Installation succeeded but dependency could not be detected. Please try again.");
        process.exitCode = 1;
        return;
      }
    }

    // Check for versions that are too old
    const tooOld = detected.filter((d) => !gte(d.version, MIN_VERSION));
    const validVersions = detected.filter((d) => gte(d.version, MIN_VERSION));

    for (const d of tooOld) {
      warn(
        `${chalk.bold(d.packageName)}: ${PACKAGES[d.type]} v${d.version} is below minimum v${MIN_VERSION}`,
      );
    }

    if (validVersions.length === 0) {
      error(`No dependencies found with version >= ${MIN_VERSION}. Cannot install.`);
      console.log("");
      process.exitCode = 1;
      return;
    }

    // Select package type — skip if already chosen during fallback install
    let chosenType: "core" | "pro";

    if (fallbackChosenType) {
      chosenType = fallbackChosenType;
    } else if (resolveType(opts.type)) {
      chosenType = resolveType(opts.type)!;
    } else if (yes) {
      chosenType = "core";
    } else {
      console.log("");
      const { packageType } = await prompts(
        {
          type: "select",
          name: "packageType",
          message: chalk.bold("Which package do you want to install skills for?"),
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

    // Prefer a detected version matching the chosen type, fall back to any valid version
    const matched = validVersions.find((d) => d.type === chosenType) ?? validVersions[0];
    const selected: DetectedVersion = { ...matched, type: chosenType };

    info(
      `Using ${chalk.bold(PACKAGES[chosenType])} ${chalk.cyan("v" + selected.version)} from ${chalk.dim(selected.packageName)}`,
    );

    console.log("");

    // Select AI type
    const aiTypes = await selectAI(opts.ai, cwd);
    if (!aiTypes) {
      process.exitCode = 1;
      return;
    }

    heading(`Installing skills · ${PACKAGES[selected.type]} v${selected.version}`);

    for (const ai of aiTypes) {
      await createSkillsFolder(cwd, ai, selected, yes);
    }

    done();
  });
