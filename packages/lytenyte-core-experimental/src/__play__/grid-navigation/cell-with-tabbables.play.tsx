import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const columns: Grid.Column[] = [
  {
    id: "age",
    colSpan: (c) => {
      return c.rowIndex === 0 || c.rowIndex === 12 ? 3 : 1;
    },
    cellRenderer: () => {
      return (
        <>
          <button tabIndex={0}>A</button>
          <button tabIndex={0}>B</button>
          <button tabIndex={0}>C</button>
        </>
      );
    },
  },
  {
    id: "job",
    colSpan: (c) => {
      return c.rowIndex === 2 ? 3 : 1;
    },
  },
  { id: "balance" },
  {
    id: "education",
    colSpan: (t) => {
      if (t.rowIndex === 4) return 2;
      if (t.rowIndex === 12) return 2;
      return 1;
    },
    cellRenderer: () => {
      return (
        <>
          <button tabIndex={0}>Prev</button>
          <button tabIndex={-1}>Not Tabbable</button>
          <button tabIndex={0}>Next</button>
        </>
      );
    },
    rowSpan: (t) => {
      if (t.rowIndex === 4) return 3;
      if (t.rowIndex === 8) return 3;
      if (t.rowIndex === 12) return 2;
      return 1;
    },
  },
  { id: "marital" },
  { id: "default" },
];

export default function CellWithTabbables({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} />;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { userEvent } = await import("vitest/browser");
  const { wait, getCellQuery } = await import("../utils.js");
  const { render } = await import("vitest-browser-react");

  test("when cells have interactive elements they should be navigable", async () => {
    const screen = await render(<CellWithTabbables />);
    const grid = screen.getByRole("grid");

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Married");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");

    (document.querySelector(getCellQuery("x", 5, 2)) as HTMLElement).focus();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("747");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
    (document.activeElement!.nextElementSibling as HTMLElement).focus();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Not Tabbable");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
    (document.activeElement!.previousElementSibling as HTMLElement).focus();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Not Tabbable");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
  });

  test("when cells have interactive elements they should be navigable rtl", async () => {
    const screen = await render(<CellWithTabbables rtl />);
    const grid = screen.getByRole("grid");

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Married");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");

    (document.querySelector(getCellQuery("x", 5, 2)) as HTMLElement).focus();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("747");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("PrevNot TabbableNext");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
    (document.activeElement!.nextElementSibling as HTMLElement).focus();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Not Tabbable");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Next");
    (document.activeElement!.previousElementSibling as HTMLElement).focus();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Not Tabbable");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Prev");
  });
}
