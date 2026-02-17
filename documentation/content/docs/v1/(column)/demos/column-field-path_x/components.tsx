import type { MonthlyTemperature } from "@1771technologies/grid-sample-data/temperatures";
import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export function HeatMapCell({
  grid: { api },
  column,
  row,
}: CellRendererParams<MonthlyTemperature>) {
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

export function YearCell({ grid: { api }, row, column }: CellRendererParams<MonthlyTemperature>) {
  const field = api.columnField(column, row);

  return `${field}`;
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
