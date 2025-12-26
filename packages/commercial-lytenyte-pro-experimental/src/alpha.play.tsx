import { useTheme } from "@1771technologies/play-frame";
import "@1771technologies/lytenyte-design/design.css";
import "@1771technologies/lytenyte-design/font.css";
import "@1771technologies/lytenyte-design/dark.css";
import "@1771technologies/lytenyte-design/light.css";
import "@1771technologies/lytenyte-design/teal.css";
import "@1771technologies/lytenyte-design/term.css";

import "../main.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { ViewportShadows } from "@1771technologies/lytenyte-core-experimental";
import { useClientDataSource } from "./data-source-client/use-client-data-source.js";
import { useMemo, useState } from "react";
import type { GridSpec, Props } from "./types";
import type { RowLeaf } from "@1771technologies/lytenyte-shared";
import { RowGroupCell } from "./components/row-group-cell.js";
import { Grid } from "./index.js";

type BankData = (typeof bankDataSmall)[number];

interface Spec extends GridSpec {
  data: BankData;
}

const columns: Grid.Column<Spec>[] = [
  { id: "age", name: "bob", groupPath: ["Alpha", "Beta"], type: "number" },
  { id: "marital", groupPath: ["Alpha"] },
  { id: "default", groupPath: ["Top Dog"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", groupPath: ["Alpha", "Beta", "Carlson"] },
  { id: "day", groupPath: ["Alpha", "Beta"] },
  { id: "month", groupPath: ["Alpha"] },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays", groupPath: ["Carlson"] },
  { id: "previous", groupPath: ["Carlson", "Delta"] },
  { id: "poutcome" },
  { id: "y" },
];

const sumAge = (rows: RowLeaf<BankData>[]) => rows.reduce((acc, x) => x.data.balance + acc, 0);

export default function Experimental() {
  const [pivotMode, setPivotMode] = useState(false);
  const ds = useClientDataSource<Spec>({
    data: bankDataSmall,
    rowGroupDefaultExpansion: true,
    group: [{ id: "marital" }, { id: "contact" }, { id: "age" }],
    pivotRowGroupDefaultExpansion: false,
    pivotMode,
    pivotGrandTotals: "bottom",
    pivotModel: {
      columns: [{ id: "contact" }, { id: "education" }],
      rows: [{ id: "marital" }, { id: "age" }],
      measures: [
        {
          dim: { id: "Balance", type: "number" },
          fn: sumAge,
        },
      ],
    },
  });
  const pivotProps = ds.usePivotProps();

  const [rowGroupColumn, setRowGroupColumn] = useState<Props<Spec>["rowGroupColumn"]>({
    cellRenderer: RowGroupCell,
  });

  const { resolvedTheme } = useTheme();
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
        <button onClick={() => setPivotMode((prev) => !prev)}>Toggle Pivot Mode</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className={"ln-grid " + (resolvedTheme === "light" ? "ln-light" : "ln-dark")}
          style={{ height: "90vh", width: "90vw" }}
        >
          <Grid
            columns={columns}
            columnBase={useMemo(() => ({ movable: true, resizable: true, width: 100 }), [])}
            slotShadows={ViewportShadows}
            columnGroupRenderer={(props) => {
              const label = props.groupPath.at(-1)!;
              return (
                <div>
                  {label}
                  {props.collapsible && (
                    <button onClick={() => props.api.columnToggleGroup(props.groupPath)}>{">"}</button>
                  )}
                </div>
              );
            }}
            rowSource={ds}
            rowGroupColumn={rowGroupColumn}
            onRowGroupColumnChange={setRowGroupColumn}
            rowSelectionMode="multiple"
            {...pivotProps}
          />
        </div>
      </div>
    </>
  );
}
