import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { computeField, Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { useState } from "react";
import { data as initialData, nextData, type DataEntry } from "./data.js";
import { GroupCell, HeaderCell, NumberCell } from "./components.jsx";
import { sum } from "es-toolkit";

export interface GridSpec {
  readonly data: DataEntry;
  readonly column: { agg?: string };
}

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "bid",
    name: "Bid",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "avg",
  },
  {
    id: "ask",
    name: "Ask",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "avg",
  },
  {
    id: "spread",
    name: "Spread",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "avg",
  },

  {
    id: "volatility",
    name: "Volatility",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "first",
  },
  {
    id: "latency",
    name: "Latency",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
    agg: "first",
  },
  {
    id: "symbol",
    name: "Symbol",
    hide: true,
    groupVisibility: "always",
    type: "number",
    agg: "first",
  },
];

const avg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values) / values.length;
};
const first: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  return computeField(field, data[0]);
};

const base: Grid.ColumnMarker<GridSpec> = { headerRenderer: HeaderCell };
const rowGroupColumn: Grid.RowGroupColumn<GridSpec> = { width: 170, cellRenderer: GroupCell, pin: "start" };

export default function CellDemo() {
  const [data, setData] = useState(initialData);

  const ds = useClientDataSource<GridSpec>({
    data,
    group: [{ id: "symbol" }],
    aggregate: columns.map((x) => ({ dim: { id: x.id }, fn: x.agg ?? "first" })),
    aggregateFns: { avg, first },
  });

  return (
    <>
      <div className="border-ln-border flex gap-4 border-b px-4 py-3">
        <button
          data-ln-button="website"
          data-ln-size="md"
          onClick={() => {
            setData(nextData());
          }}
        >
          Update Data
        </button>
      </div>

      <div className="ln-grid" style={{ height: 500 }}>
        <Grid columns={columns} rowSource={ds} rowGroupColumn={rowGroupColumn} columnBase={base} />
      </div>
    </>
  );
}
