import chalk from "chalk";

export const BRAND = "⚡";

export function banner() {
  console.log("");
  console.log(chalk.bold.cyan(`  ${BRAND} Skills CLI`) + chalk.dim(" v1.0.0"));
  console.log(chalk.dim("  ─────────────────────────────────"));
  console.log("");
}

export function heading(text: string) {
  console.log("");
  console.log(`  ${chalk.bold.cyan(BRAND)} ${chalk.bold(text)}`);
  console.log("");
}

export function success(text: string) {
  console.log(`  ${chalk.green("✔")} ${text}`);
}

export function info(text: string) {
  console.log(`  ${chalk.blue("ℹ")} ${chalk.blue(text)}`);
}

export function warn(text: string) {
  console.log(`  ${chalk.yellow("⚠")} ${chalk.yellow(text)}`);
}

export function error(text: string) {
  console.log(`  ${chalk.red("✖")} ${chalk.red(text)}`);
}

export function done() {
  console.log("");
  console.log(`  ${chalk.green("✨")} ${chalk.bold.green("All done!")}`);
  console.log("");
}

export function skip(text: string) {
  console.log(`  ${chalk.yellow("→")} ${chalk.dim(text)}`);
}

export function divider() {
  console.log(chalk.dim("  ─────────────────────────────────"));
}
