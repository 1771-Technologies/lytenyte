import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const columns: Grid.Column[] = [
  {
    id: "age",
    pin: "start",
    colSpan: (c) => {
      return c.rowIndex === 0 ? 10 : 1;
    },
  },
  { id: "marital", pin: "start" },
  { id: "default" },
  { id: "housing", colSpan: 2 },
  { id: "loan" },
  { id: "contact", pin: "end" },
  { id: "day", pin: "end" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", colSpan: 2 },
  { id: "y" },
];

export default function CellSpansWithPins({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} />;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { userEvent } = await import("vitest/browser");
  const { wait, getCellQuery } = await import("../utils.js");
  const { render } = await import("vitest-browser-react");

  test("when the columns are pinned should be navigate across them", async () => {
    const screen = await render(<CellSpansWithPins />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    const expected = ["30", "No", "No", "Oct", "79", "1", "-1", "0", "Unknown", "Cellular", "19"];
    for (const ex of expected) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
      await userEvent.keyboard("{ArrowRight}");
      await wait();
    }
    for (const ex of expected.toReversed()) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
      await userEvent.keyboard("{ArrowLeft}");
      await wait();
    }

    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("19");
    await userEvent.keyboard("{Control>}{ArrowLeft}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
  });

  test("when the columns are pinned should be navigate across them", async () => {
    const screen = await render(<CellSpansWithPins rtl />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    const expected = ["30", "No", "No", "Oct", "79", "1", "-1", "0", "Unknown", "Cellular", "19"];
    for (const ex of expected) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
      await userEvent.keyboard("{ArrowLeft}");
      await wait();
    }
    for (const ex of expected.toReversed()) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
      await userEvent.keyboard("{ArrowRight}");
      await wait();
    }

    await userEvent.keyboard("{Control>}{ArrowLeft}{/Control}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("19");
    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
  });
}
