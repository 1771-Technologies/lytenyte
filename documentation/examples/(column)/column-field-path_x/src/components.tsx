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

  const value = api.columnField(column, row) as number;

  const bg = valueToColor(value);

  return (
    <div
      style={{ background: bg }}
      className="flex h-full w-full items-center justify-center font-bold text-white group-hover:opacity-90"
    >
      {value}
    </div>
  );
}

export function YearCell({ grid: { api }, row, column }: CellRendererParams<MonthlyTemperature>) {
  const field = api.columnField(column, row);

  return `${field}`;
}

/**
 * Returns a color between blue and red based on a value.
 * - value <= 0  => pure blue (#0000FF)
 * - value >= 30 => pure red (#FF0000)
 * - values in between interpolate smoothly from blue → red
 */
export function valueToColor(value: number): string {
  const min = 0;
  const max = 30;

  // Clamp + normalize value between 0 and 1
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));

  // Blue → Red interpolation:
  // Blue = (0, 0, 255)
  // Red  = (255, 0, 0)
  const r = Math.round(255 * t);
  const g = 0; // stays at 0
  const b = Math.round(255 * (1 - t));

  return `rgb(${r}, ${g}, ${b})`;
}
