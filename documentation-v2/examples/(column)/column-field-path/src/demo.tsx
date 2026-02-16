//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import type { MonthlyTemperature } from "@1771technologies/grid-sample-data/temperatures";
import { data } from "@1771technologies/grid-sample-data/temperatures";
//#end

export interface GridSpec {
  readonly data: MonthlyTemperature;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "year", name: "Year", cellRenderer: YearCell, width: 100 },
  { id: "Jan", field: { kind: "path", path: "temps.Jan" } },
  { id: "Feb", field: { kind: "path", path: "temps.Feb" } },
  { id: "Mar", field: { kind: "path", path: "temps.Mar" } },
  { id: "Apr", field: { kind: "path", path: "temps.Apr" } },
  { id: "May", field: { kind: "path", path: "temps.May" } },
  { id: "Jun", field: { kind: "path", path: "temps.Jun" } },
  { id: "Jul", field: { kind: "path", path: "temps.Jul" } },
  { id: "Aug", field: { kind: "path", path: "temps.Aug" } },
  { id: "Sep", field: { kind: "path", path: "temps.Sep" } },
  { id: "Oct", field: { kind: "path", path: "temps.Oct" } },
  { id: "Nov", field: { kind: "path", path: "temps.Nov" } },
  { id: "Dec", field: { kind: "path", path: "temps.Dec" } },
];

const base: Grid.ColumnBase<GridSpec> = { widthMin: 30, width: 50, widthFlex: 1, cellRenderer: HeatMapCell };

export default function ColumnDemo() {
  const ds = useClientDataSource({ data: data });

  return (
    <div
      className="ln-grid ln-cell:tabular-nums ln-header:tabular-nums ln-cell:px-0 ln-row-hover:bg-ln-primary-50/10 ln-cell:border-e ln-cell:border-ln-border-strong ln-header:justify-center"
      style={{ height: 500 }}
    >
      <Grid rowSource={ds} columns={columns} columnBase={base} />
    </div>
  );
}

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
