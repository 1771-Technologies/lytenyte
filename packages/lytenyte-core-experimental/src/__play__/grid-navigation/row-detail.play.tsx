import "../test.css";
import "./navigation.css";
import { Grid, useClientDataSource } from "../../index.js";
import { useState } from "react";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";

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

const rowDetailRenderer: Grid.Props["rowDetailRenderer"] = () => {
  return (
    <div>
      <button tabIndex={0}>Detail A</button>
      <button tabIndex={0}>Detail B</button>
    </div>
  );
};

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

export default function RowDetail({ rtl, columns }: { rtl?: boolean; columns?: Grid.Column[] }) {
  const ds = useClientDataSource({
    data: bankDataSmall,
  });

  const [expansions, setExpansions] = useState<Grid.Props["rowDetailExpansions"]>(
    new Set(["leaf-2", "leaf-5"]),
  );

  const [marker] = useState<Grid.ColumnMarker>({
    on: true,
    width: 60,
    cellRenderer: (p) => <button onClick={() => p.api.rowDetailToggle(p.row.id)}>+</button>,
  });

  return (
    <div className="with-border-cells">
      <button tabIndex={0} onClick={() => {}}>
        Top Capture
      </button>
      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
        <Grid
          gridId="x"
          columns={columns ?? baseColumns}
          rowSource={ds}
          rtl={rtl}
          rowDetailExpansions={expansions}
          onRowDetailExpansionsChange={setExpansions}
          columnMarker={marker}
          rowFullWidthPredicate={rowFullWidthPredicate}
          rowFullWidthRenderer={rowFullWidthRenderer}
          rowDetailRenderer={rowDetailRenderer}
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

  test("when row details are present it should be possible to navigate across them", async () => {
    const screen = await render(<RowDetail />);
    const grid = screen.getByRole("grid");

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 0)) as HTMLElement;
    ourFirstCell.focus();
    await expect.element(ourFirstCell).toHaveFocus();

    await userEvent.keyboard("{ArrowDown}");
    await wait();
    await userEvent.keyboard("{ArrowDown}");
    await wait();
    await userEvent.keyboard("{ArrowDown}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Detail A");

    await userEvent.keyboard("{ArrowLeft}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Detail ADetail B");
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Detail B");
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Detail A");
    await userEvent.keyboard("{ArrowDown}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("+");
    await userEvent.keyboard("{ArrowDown}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("ABC");
    await userEvent.keyboard("{ArrowUp}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("+");
    await userEvent.keyboard("{ArrowUp}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Detail A");
    await userEvent.keyboard("{ArrowDown}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("+");
    await userEvent.keyboard("{ArrowLeft}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("+");
    await userEvent.click(document.activeElement!);
    await wait();
    await userEvent.keyboard("{ArrowDown}");
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Detail A");
  });
}
