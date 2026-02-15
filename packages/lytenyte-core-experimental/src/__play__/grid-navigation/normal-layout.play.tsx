import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import "./navigation.css";
import { useState } from "react";

const baseColumns: Grid.Column[] = [
  { id: "age" },
  { id: "job" },
  { id: "balance" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];
export default function NormalLayout({
  rtl,
  columns,
  pinTop,
  center,
  pinBot,
  floatingRow,
}: {
  rtl?: boolean;
  columns?: Grid.Column[];
  center?: number;
  pinTop?: number;
  pinBot?: number;
  floatingRow?: boolean;
}) {
  const [x, setColumns] = useState(columns ?? baseColumns);
  const ds = useClientDataSource({
    data: center ? bankDataSmall.slice(0, center) : bankDataSmall,
    topData: pinTop ? bankDataSmall.slice(0, pinTop) : [],
    bottomData: pinBot ? bankDataSmall.slice(0, pinBot) : [],
  });

  return (
    <div className="with-border-cells">
      <button tabIndex={0} onClick={() => {}}>
        Top Capture
      </button>
      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Grid
          gridId="x"
          columns={x ?? baseColumns}
          onColumnsChange={setColumns}
          rowSource={ds}
          rtl={rtl}
          floatingRowEnabled={floatingRow}
          columnBase={{ resizable: true }}
        />
      </div>
      <button tabIndex={0} onClick={() => {}}>
        Bottom Capture
      </button>
    </div>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;
  const { userEvent } = await import("vitest/browser");
  const { wait, getCellQuery } = await import("../utils.js");
  const { render } = await import("vitest-browser-react");

  test("when the grid is rendered tabbing through show skip cells inside", async () => {
    const screen = await render(<NormalLayout />);
    const start = screen.getByText("Top Capture");
    await wait(100);

    await expect.element(start).toBeVisible();
    start.element().focus();
    await expect.element(start).toHaveFocus();

    await userEvent.keyboard("{Tab}");
    const grid = screen.getByRole("grid");
    await expect.element(grid).toHaveFocus();

    await userEvent.keyboard("{Tab}");
    await expect.element(screen.getByText("Bottom Capture")).toHaveFocus();

    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect.element(grid).toHaveFocus();
    await userEvent.keyboard("{Shift>}{Tab}{/Shift}");
    await expect.element(start).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await userEvent.keyboard("{Tab}");

    await wait(100);
    await expect.element(screen.getByText("Bottom Capture")).toHaveFocus();
  });

  test("when a cell is focused, we can navigate to the start and end", async () => {
    const screen = await render(<NormalLayout />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 2, 0)) as HTMLElement;
    ourFirstCell.focus();

    await expect.element(ourFirstCell).toHaveFocus();
    const expected = [
      "35",
      "Management",
      "1350",
      "Tertiary",
      "Single",
      "No",
      "Yes",
      "No",
      "Cellular",
      "16",
      "Apr",
      "185",
      "1",
      "330",
      "1",
      "Failure",
      "No",
    ];

    for (const ex of expected) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
      await userEvent.keyboard("{ArrowRight}");
      await wait();
    }
    // Pressing arrow right again should result in a no op
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent(expected.at(-1)!);

    // Now go in reverse
    for (const ex of expected.toReversed()) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(ex);
      await userEvent.keyboard("{ArrowLeft}");
      await wait();
    }
  });

  test("when a cell is focused, we can navigate to the start and end in rtl", async () => {
    const screen = await render(<NormalLayout rtl />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 2, 0)) as HTMLElement;
    await wait(100);
    ourFirstCell.focus();

    await expect.element(ourFirstCell).toHaveFocus();
    const expected = [
      "35",
      "Management",
      "1350",
      "Tertiary",
      "Single",
      "No",
      "Yes",
      "No",
      "Cellular",
      "16",
      "Apr",
      "185",
      "1",
      "330",
      "1",
      "Failure",
      "No",
    ];

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

  test("should be able to navigate up and down cells", async () => {
    const screen = await render(<NormalLayout center={50} />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement;
    ourFirstCell.focus();

    const values = bankDataSmall.slice(0, 50).map((c) => `${c.age}`);

    for (const v of values) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(v);
      await userEvent.keyboard("{ArrowDown}");
    }
    for (const v of values.toReversed()) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(v);
      await userEvent.keyboard("{ArrowUp}");
    }
  });

  test("should be able to navigate up and down cells with pins", async () => {
    const screen = await render(<NormalLayout pinTop={2} pinBot={2} center={50} />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement;
    ourFirstCell.focus();

    const values = bankDataSmall
      .slice(0, 2)
      .map((c) => `${c.age}`)
      .concat(bankDataSmall.slice(0, 50).map((c) => `${c.age}`))
      .concat(bankDataSmall.slice(0, 2).map((c) => `${c.age}`));

    for (const v of values) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(v);
      await userEvent.keyboard("{ArrowDown}");
    }
    for (const v of values.toReversed()) {
      await expect.element(document.activeElement as HTMLElement).toHaveTextContent(v);
      await userEvent.keyboard("{ArrowUp}");
    }
  });

  test("should be able to handle moving to the start or end", async () => {
    const screen = await render(<NormalLayout />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement;
    ourFirstCell.focus();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");

    await userEvent.keyboard("{Control>}{ArrowDown}{/Control}");
    await wait(200);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("36");
    await userEvent.keyboard("{Control>}{ArrowUp}{/Control}");
    await wait(200);
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("30");
  });
}
