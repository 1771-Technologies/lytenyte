import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import "./navigation.css";
import { useState } from "react";

const baseColumns: Grid.Column<any>[] = [
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
    <div style={{ padding: 20, height: "100%", boxSizing: "border-box" }}>
      <div style={{ height: "100%", boxSizing: "border-box" }}>
        <NestedGrid />
      </div>
    </div>
  );
};

export default function BasicRendering({
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
  const ds = useClientDataSource({
    data: center ? bankDataSmall.slice(0, center) : bankDataSmall,
    topData: pinTop ? bankDataSmall.slice(0, pinTop) : [],
    bottomData: pinBot ? bankDataSmall.slice(0, pinBot) : [],
  });

  const [expansions, setExpansions] = useState<Grid.Props["rowDetailExpansions"]>(new Set("1"));

  const [marker] = useState<Grid.ColumnMarker>({
    on: true,
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
          columnMarker={marker}
          rtl={rtl}
          floatingRowEnabled={floatingRow}
          rowDetailRenderer={rowDetailRenderer}
          rowDetailHeight={400}
          onRowDetailExpansionsChange={setExpansions}
          rowDetailExpansions={expansions}
        />
      </div>
      <button tabIndex={0} onClick={() => {}}>
        Bottom Capture
      </button>
    </div>
  );
}

function NestedGrid() {
  const ds = useClientDataSource({
    data: bankDataSmall,
  });

  return <Grid columns={baseColumns} rowSource={ds} />;
}
