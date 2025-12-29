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

  const [expansions, setExpansions] = useState<Grid.Props["rowDetailExpansions"]>(new Set(["2", "5"]));

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
