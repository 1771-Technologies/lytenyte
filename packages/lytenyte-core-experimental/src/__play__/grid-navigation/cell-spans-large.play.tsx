import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const columns: Grid.Column[] = [
  {
    id: "age",
    colSpan: (c) => {
      return c.rowIndex === 0 ? 10 : 1;
    },
  },
  { id: "marital" },
  { id: "default" },
  { id: "housing", colSpan: 2 },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", colSpan: 2 },
  { id: "y" },
];

export default function CellSpansLarge({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} />;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { userEvent } = await import("vitest/browser");
  const { wait, getCellQuery } = await import("../utils.js");
  const { render } = await import("vitest-browser-react");

  test("when a column span is large navigation should still work", async () => {
    const screen = await render(<CellSpansLarge />);
    const grid = screen.getByRole("grid");

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait(100);

    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("-1");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("0");
    await userEvent.keyboard("{ArrowRight}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Unknown");
    await userEvent.keyboard("{ArrowLeft}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("0");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("-1");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
  });

  test("when a column span is large navigation should still work rtl", async () => {
    const screen = await render(<CellSpansLarge rtl />);
    const grid = screen.getByRole("grid");

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("-1");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("0");
    await userEvent.keyboard("{ArrowLeft}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Unknown");
    await userEvent.keyboard("{ArrowRight}");
    await wait(100);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("0");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("-1");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
  });
}
