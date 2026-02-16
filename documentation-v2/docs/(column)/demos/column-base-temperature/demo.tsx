//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import type { MonthlyTemperature } from "@1771technologies/grid-sample-data/temperatures";
import { data } from "@1771technologies/grid-sample-data/temperatures";
//#end

interface GridSpec {
  data: MonthlyTemperature;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "year", name: "Year", cellRenderer: YearCell, width: 100 },
  { id: "Jan" },
  { id: "Feb" },
  { id: "Mar" },
  { id: "Apr" },
  { id: "May" },
  { id: "Jun" },
  { id: "Jul" },
  { id: "Aug" },
  { id: "Sep" },
  { id: "Oct" },
  { id: "Nov" },
  { id: "Dec" },
];

//!next 6
const base: Grid.ColumnBase<GridSpec> = {
  widthMin: 30,
  widthMax: 50,
  widthFlex: 1,
  cellRenderer: HeatMapCell,
};

export default function ColumnDemo() {
  const ds = useClientDataSource({ data: data });

  return (
    <div
      className="ln-grid ln-cell:tabular-nums ln-header:tabular-nums ln-cell:px-0 ln-row-hover:bg-ln-primary-50/10 ln-cell:border-e ln-cell:border-ln-border-strong ln-header:justify-center"
      style={{ height: 500 }}
    >
      <Grid columnBase={base} rowSource={ds} columns={columns} /> //!
    </div>
  );
}
//#start

export function HeatMapCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const value = row.data.temps[column.id as keyof MonthlyTemperature["temps"]];

  const bg = valueToColor(value);

  return (
    <div
      style={{ background: bg }}
      className="flex h-full w-full items-center justify-center text-white group-hover:opacity-70"
    >
      {value.toFixed(1)}°C
    </div>
  );
}

export function YearCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return <div className="flex h-full w-full items-center justify-center">{String(field)}</div>;
}

/**
 * Interpolate between two HSL colors based on value in [0, 30].
 * 0  -> hsl(173.4 80.4% 40%)
 * 30 -> hsl(0 84.2% 60.2%)
 */
export function valueToColor(value: number): string {
  const percentage = Math.min((value / 19) * 100, 100);

  const start = "174.7 83.9% 31.6%";
  const end = "178.6 84.3% 10%";

  return `color-mix(in hsl, hsl(${start}) ${100 - percentage}%, hsl(${end}) ${percentage}%)`;
}
//#end
