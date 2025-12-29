import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const baseColumns: Grid.Column[] = [
  { id: "age", pin: "start" },
  { id: "job" },
  { id: "marital" },
  { id: "housing", pin: "end" },
];

export default function PinnedGapLayout({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={baseColumns} rtl={rtl} />;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { userEvent } = await import("vitest/browser");
  const { wait, getCellQuery } = await import("../utils.js");
  const { render } = await import("vitest-browser-react");

  test("when there columns pinned left and right and there is a gap the navigation should still work", async () => {
    const screen = await render(<PinnedGapLayout rtl />);
    const grid = screen.getByRole("grid");

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 2, 0)) as HTMLElement;
    ourFirstCell.focus();

    await expect.element(ourFirstCell).toHaveFocus();
    const expected = ["35", "Management", "Single", "Yes"];

    for (const ex of expected) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
      await userEvent.keyboard("{ArrowLeft}");
      await wait();
    }
    // Pressing arrow right again should result in a no op
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(expected.at(-1)!);

    // Now go in reverse
    for (const ex of expected.toReversed()) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
      await userEvent.keyboard("{ArrowRight}");
      await wait();
    }
  });
}
