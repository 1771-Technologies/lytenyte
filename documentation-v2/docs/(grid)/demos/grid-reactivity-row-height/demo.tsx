//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { BalanceCell, DurationCell, NumberCell, ToggleGroup, ToggleItem } from "./components.js";
import { useState } from "react";

type BankData = (typeof bankDataSmall)[number];
export interface GridSpec {
  readonly data: BankData;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120 },
  { name: "Age", id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: BalanceCell },
  { name: "Education", id: "education" },
  { name: "Marital", id: "marital" },
  { name: "Default", id: "default" },
  { name: "Housing", id: "housing" },
  { name: "Loan", id: "loan" },
  { name: "Contact", id: "contact" },
  { name: "Day", id: "day", type: "number", cellRenderer: NumberCell },
  { name: "Month", id: "month" },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
];

const base = { width: 100 };

//#end
export default function GridReactivityRowHeight() {
  const ds = useClientDataSource({ data: bankDataSmall });

  const [rowHeight, setRowHeight] = useState(40); //!

  return (
    <div className="ln-grid" style={{ display: "flex", flexDirection: "column" }}>
      <div className="border-b-ln-border flex w-full border-b px-2 py-2">
        <ToggleGroup
          type="single"
          value={`${rowHeight}`}
          onValueChange={(c) => {
            if (!c) return;
            setRowHeight(Number.parseInt(c)); //!
          }}
        >
          <ToggleItem value="20">Small</ToggleItem>
          <ToggleItem value="40">Medium</ToggleItem>
          <ToggleItem value="60">Large</ToggleItem>
          <ToggleItem value="80">Extra Large</ToggleItem>
        </ToggleGroup>
      </div>
      <div style={{ height: 500 }}>
        {/*!next */}
        <Grid columns={columns} columnBase={base} rowHeight={rowHeight} rowSource={ds} />
      </div>
    </div>
  );
}
