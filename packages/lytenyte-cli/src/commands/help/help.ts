import { Command } from "commander";
import chalk from "chalk";
import { banner, divider } from "../../utils/ui.js";

export const help = new Command("help").description("Show help and usage information").action(() => {
  banner();

  console.log(chalk.bold("  📦 Commands\n"));

  const commands = [
    {
      name: "install",
      desc: "Install skills for your AI assistants",
      flags: "--ai <type|all> --type <core|pro> -y",
    },
    { name: "versions", desc: "List available package versions", flags: "[core|pro|all]" },
    {
      name: "update",
      desc: "Update skills to match installed version",
      flags: "--ai <type|all> --type <core|pro> -y",
    },
    { name: "uninstall", desc: "Remove installed skills", flags: "--ai <type|all> -y" },
    { name: "help", desc: "Show this help message", flags: "" },
  ];

  for (const cmd of commands) {
    console.log(
      `  ${chalk.cyan("$")} ${chalk.bold(`skills ${cmd.name}`)}` +
        (cmd.flags ? chalk.dim(` ${cmd.flags}`) : ""),
    );
    console.log(chalk.dim(`     ${cmd.desc}`));
    console.log("");
  }

  divider();
  console.log("");
  console.log(chalk.bold("  ⚙️  Flags\n"));
  console.log(
    `  ${chalk.bold("--ai <type>")}    ${chalk.dim("AI assistant to target (e.g. claude, cursor, copilot, or 'all')")}`,
  );
  console.log(`  ${chalk.bold("--type <type>")}  ${chalk.dim("Package type: core or pro")}`);
  console.log(
    `  ${chalk.bold("-y, --yes")}      ${chalk.dim("Skip all confirmation prompts (requires --ai for install)")}`,
  );
  console.log("");

  divider();
  console.log("");
  console.log(chalk.bold("  🌐 Environment Variables\n"));
  console.log(
    `  ${chalk.bold("SKILLS_VERSION")}  ${chalk.dim("Override the version fetched from npm registry")}`,
  );
  console.log("");

  divider();
  console.log("");
  console.log(chalk.bold("  🤖 Supported AI Assistants\n"));
  console.log(
    chalk.dim(
      "  Claude Code · Cursor · Windsurf · Copilot · Kiro · Codex\n" +
        "  RooCode · Gemini · Trae · OpenCode · Continue · CodeBuddy\n" +
        "  Antigravity · Droid · KiloCode · Warp · Augment · Qoder",
    ),
  );

  console.log("");
  divider();
  console.log("");
  console.log(chalk.bold("  💡 Examples\n"));
  console.log(`  ${chalk.dim("# Interactive mode — just run without arguments")}`);
  console.log(`  ${chalk.cyan("$")} ${chalk.bold("skills")}`);
  console.log("");
  console.log(`  ${chalk.dim("# Install skills for Claude")}`);
  console.log(`  ${chalk.cyan("$")} ${chalk.bold("skills install")} ${chalk.dim("--ai claude")}`);
  console.log("");
  console.log(`  ${chalk.dim("# Install PRO skills for all AI assistants (non-interactive)")}`);
  console.log(
    `  ${chalk.cyan("$")} ${chalk.bold("skills install")} ${chalk.dim("--ai all --type pro --yes")}`,
  );
  console.log("");
  console.log(`  ${chalk.dim("# View PRO versions")}`);
  console.log(`  ${chalk.cyan("$")} ${chalk.bold("skills versions")} ${chalk.dim("pro")}`);
  console.log("");
  console.log(`  ${chalk.dim("# Update all installed skills")}`);
  console.log(`  ${chalk.cyan("$")} ${chalk.bold("skills update")}`);
  console.log("");
  console.log(`  ${chalk.dim("# Uninstall all skills without prompts")}`);
  console.log(`  ${chalk.cyan("$")} ${chalk.bold("skills uninstall")} ${chalk.dim("--ai all --yes")}`);
  console.log("");
  console.log(`  ${chalk.dim("# Run via npx")}`);
  console.log(`  ${chalk.cyan("$")} ${chalk.bold("npx skills-cli")} ${chalk.dim("install")}`);
  console.log("");
});
