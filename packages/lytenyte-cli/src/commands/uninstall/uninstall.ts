import process from "node:process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { Command } from "commander";
import chalk from "chalk";
import prompts from "prompts";
import { AI_CONFIGS, type AIType } from "../../types/index.js";
import { findInstalled } from "../../utils/detect-versions.js";
import { multiselect } from "../../utils/multiselect.js";
import { heading, success, warn, done, skip, error, info } from "../../utils/ui.js";

function onCancel() {
  console.log(chalk.dim("\n  Cancelled.\n"));
  process.exit(130);
}

async function removeSkillsFolder(cwd: string, aiType: Exclude<AIType, "all">, yes: boolean): Promise<void> {
  const config = AI_CONFIGS[aiType];
  const skillsDir = join(cwd, config.skillsPath, "lytenyte-skills");

  if (!existsSync(skillsDir)) {
    skip(`${config.label} — no skills found`);
    return;
  }

  if (!yes) {
    const { confirm } = await prompts(
      {
        type: "confirm",
        name: "confirm",
        message: `Remove skills for ${chalk.bold(config.label)}?`,
        initial: false,
      },
      { onCancel },
    );

    if (!confirm) {
      skip(`${config.label} — kept`);
      return;
    }
  }

  rmSync(skillsDir, { recursive: true });
  success(`${config.label} → ${chalk.dim("removed " + config.skillsPath + "/lytenyte-skills")}`);
}

export const uninstall = new Command("uninstall")
  .description("Remove installed skills")
  .option("--ai <type>", "AI assistant type (or 'all')")
  .option("-y, --yes", "Skip all confirmation prompts")
  .action(async (opts: { ai?: string; yes?: boolean }) => {
    const cwd = process.cwd();
    const yes = opts.yes ?? false;

    heading("🗑️  Uninstall Skills");

    const installed = findInstalled(cwd);

    if (installed.length === 0) {
      warn("No installed skills found. Nothing to uninstall.");
      console.log("");
      return;
    }

    info(`Found skills: ${chalk.bold(installed.map((i) => AI_CONFIGS[i].label).join(", "))}`);
    console.log("");

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
      const selected = await multiselect(
        "Which AI assistants do you want to uninstall?",
        installed.map((key) => ({
          label: AI_CONFIGS[key].label,
          value: key,
          selected: true,
        })),
      );

      if (!selected) return;
      aiTypes = selected as Exclude<AIType, "all">[];
    }

    heading("Removing skills");

    for (const ai of aiTypes) {
      await removeSkillsFolder(cwd, ai, yes);
    }

    done();
  });
