import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const columns: Grid.Column[] = [
  {
    id: "age",
    groupPath: ["A", "B"],
  },
  { id: "marital", groupPath: ["A"] },
  { id: "default", groupPath: ["T"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", groupPath: ["A", "B", "C"] },
  { id: "day", groupPath: ["A", "B"] },
  { id: "month", groupPath: ["A"] },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays", groupPath: ["C"] },
  { id: "previous", groupPath: ["C", "D"] },
  { id: "poutcome", colSpan: 2 },
  { id: "y" },
];

export default function ColumnGroups({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} floatingRow />;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { userEvent } = await import("vitest/browser");
  const { wait, getCellQuery } = await import("../utils.js");
  const { render } = await import("vitest-browser-react");

  test("when the floating cell is focused should be to navigate through it", async () => {
    const screen = await render(<ColumnGroups />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("age");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("housing");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
  });

  test("when the header is focused should be to navigate through it", async () => {
    const screen = await render(<ColumnGroups />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    await userEvent.keyboard("{ArrowUp}");
    await wait();
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("age");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("housing");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
  });

  test("when the header group is focused should be able to navigate through", async () => {
    const screen = await render(<ColumnGroups />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement).focus();
    await wait();

    await userEvent.keyboard("{ArrowUp}");
    await userEvent.keyboard("{ArrowUp}");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("T");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("default");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("marital");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("contact");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("day");
  });
}
