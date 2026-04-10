import process from "node:process";
import readline from "node:readline";
import chalk from "chalk";

export interface Choice {
  label: string;
  value: string;
  selected: boolean;
}

export async function multiselect(message: string, choices: Choice[]): Promise<string[] | null> {
  const items = choices.map((c) => ({ ...c }));
  let cursor = 0;
  let lineCount = 0;

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  readline.emitKeypressEvents(process.stdin, rl);
  if (process.stdin.isTTY) process.stdin.setRawMode(true);

  const selectedCount = () => items.filter((i) => i.selected).length;

  function buildLines(): string[] {
    const lines: string[] = [];

    lines.push(chalk.bold.cyan("?") + chalk.bold(` ${message}`));
    lines.push(chalk.dim("  ↑/↓ navigate · space toggle · a toggle all · enter confirm · esc cancel"));
    lines.push("");

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const isCursor = i === cursor;
      const tick = item.selected ? chalk.green("✔") : chalk.dim("○");
      const pointer = isCursor ? chalk.cyan("❯") : " ";
      const label = isCursor
        ? item.selected
          ? chalk.green.bold(item.label)
          : chalk.cyan.bold(item.label)
        : item.selected
          ? chalk.green(item.label)
          : chalk.dim(item.label);

      lines.push(`  ${pointer} ${tick} ${label}`);
    }

    lines.push("");
    const count = selectedCount();
    const countText = count === 0 ? chalk.dim("  No items selected") : chalk.dim(`  ${count} selected`);
    lines.push(countText);

    return lines;
  }

  function render(isInitial = false) {
    process.stdout.write("\x1B[?25l");

    if (!isInitial && lineCount > 0) {
      process.stdout.write(`\x1B[${lineCount}A\x1B[0J`);
    }

    const lines = buildLines();
    lineCount = lines.length;
    process.stdout.write(lines.join("\n") + "\n");
  }

  render(true);

  return new Promise<string[] | null>((resolve) => {
    function onKeypress(_: string, key: readline.Key) {
      if (key.name === "up" || (key.name === "k" && !key.ctrl)) {
        cursor = (cursor - 1 + items.length) % items.length;
        render();
      } else if (key.name === "down" || (key.name === "j" && !key.ctrl)) {
        cursor = (cursor + 1) % items.length;
        render();
      } else if (key.name === "space") {
        items[cursor].selected = !items[cursor].selected;
        render();
      } else if (key.name === "a") {
        const allSelected = items.every((i) => i.selected);
        for (const item of items) item.selected = !allSelected;
        render();
      } else if (key.name === "return") {
        cleanup();
        const selected = items.filter((i) => i.selected).map((i) => i.value);
        resolve(selected.length > 0 ? selected : null);
      } else if (key.name === "c" && key.ctrl) {
        cleanup();
        resolve(null);
      } else if (key.name === "escape") {
        cleanup();
        resolve(null);
      }
    }

    function cleanup() {
      process.stdin.removeListener("keypress", onKeypress);
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      // Show cursor again
      process.stdout.write("\x1B[?25h");
      rl.close();
    }

    process.stdin.on("keypress", onKeypress);
  });
}
