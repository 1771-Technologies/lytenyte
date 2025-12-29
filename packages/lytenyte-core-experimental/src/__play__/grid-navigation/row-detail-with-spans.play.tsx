import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid } from "../../index.js";
import { useClientDataSource } from "../../index.js";
import "./navigation.css";
import { useState } from "react";

const baseColumns: Grid.Column[] = [
  { id: "age" },
  {
    id: "job",
    rowSpan: (c) => {
      if (c.rowIndex === 0) return 5;
      return 1;
    },
  },
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

export default function RowDetailWithSpans({ rtl, columns }: { rtl?: boolean; columns?: Grid.Column[] }) {
  const ds = useClientDataSource({
    data: bankDataSmall,
  });

  const [expansions, setExpansions] = useState<Grid.Props["rowDetailExpansions"]>(new Set(["leaf-2"]));

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
          columnMarker={marker}
          onRowDetailExpansionsChange={setExpansions}
          rowDetailExpansions={expansions}
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

  test("when there are row spans it should be cutoff when the detail is expanded", async () => {
    const screen = await render(<RowDetailWithSpans />);
    const grid = screen.getByRole("grid");

    await expect.element(grid).toBeVisible();
    await wait(); // Give the grid a moment to render

    const ourFirstCell = document.querySelector(getCellQuery("x", 0, 2)) as HTMLElement;
    ourFirstCell.focus();
    await expect.element(ourFirstCell).toHaveFocus();

    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Unemployed");
    await userEvent.keyboard("{ArrowDown}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Management");
    await userEvent.keyboard("{ArrowDown}");
    await wait();
    await expect.element(document.activeElement as HTMLElement).toHaveTextContent("Detail A");
  });
}
