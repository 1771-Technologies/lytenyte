import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import "./navigation.css";

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

const rowFullWidthPredicate: Grid.Props["rowFullWidthPredicate"] = (r) => r.rowIndex === 2 || r.rowIndex == 4;
const rowFullWidthRenderer: Grid.Props["rowFullWidthRenderer"] = (r) => {
  if (r.rowIndex === 2) return <div>Nothing</div>;

  return (
    <div>
      <button tabIndex={0}>A</button>
      <button tabIndex={0}>B</button>
      <button tabIndex={0}>C</button>
    </div>
  );
};

export default function FullWidthRows({ rtl, columns }: { rtl?: boolean; columns?: Grid.Column[] }) {
  const ds = useClientDataSource({
    data: bankDataSmall,
  });

  return (
    <div>
      <button tabIndex={0} onClick={() => {}}>
        Top Capture
      </button>
      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Grid
          gridId="x"
          columns={columns ?? baseColumns}
          rowSource={ds}
          rtl={rtl}
          rowFullWidthPredicate={rowFullWidthPredicate}
          rowFullWidthRenderer={rowFullWidthRenderer}
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

  test("full width row navigation should correctly handle the tabbables", async () => {
    const screen = await render(<FullWidthRows />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (
      document.querySelector(
        `[data-ln-gridid="x"][data-ln-rowtype="full-width"][data-ln-rowindex="2"] > div `,
      ) as HTMLElement
    ).focus();
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
    await userEvent.keyboard("{ArrowRight}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");

    (
      document.querySelector(
        `[data-ln-gridid="x"][data-ln-rowtype="full-width"][data-ln-rowindex="4"] > div `,
      ) as HTMLElement
    ).focus();
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
  });

  test("full width row navigation should correctly handle the tabbables rtl", async () => {
    const screen = await render(<FullWidthRows rtl />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    (
      document.querySelector(
        `[data-ln-gridid="x"][data-ln-rowtype="full-width"][data-ln-rowindex="2"] > div `,
      ) as HTMLElement
    ).focus();
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
    await userEvent.keyboard("{ArrowRight}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");

    (
      document.querySelector(
        `[data-ln-gridid="x"][data-ln-rowtype="full-width"][data-ln-rowindex="4"] > div `,
      ) as HTMLElement
    ).focus();
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("B");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
    await userEvent.keyboard("{ArrowLeft}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("A");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("C");
  });

  test("should be navigate across full width rows", async () => {
    const screen = await render(<FullWidthRows />);
    const grid = screen.getByRole("grid");
    await wait(100);

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 2)) as HTMLElement;
    ourFirstCell.focus();

    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("1787");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("4789");

    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("1476");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("747");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("1476");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Nothing");
    await userEvent.keyboard("{ArrowUp}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("4789");
  });
}
