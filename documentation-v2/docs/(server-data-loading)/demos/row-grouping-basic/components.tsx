import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";
import type { GridSpec } from "./demo";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

function SkeletonLoading() {
  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-100"></div>
    </div>
  );
}

const formatter = new Intl.NumberFormat("en-Us", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export function SalaryRenderer({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return "-";

  return <div className="flex h-full w-full items-center justify-end">${formatter.format(field)}</div>;
}

export function YearsOfExperienceRenderer({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return "-";

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      <span className="font-bold">{field}</span>{" "}
      <span className="text-xs">{field <= 1 ? "Year" : "Years"}</span>
    </div>
  );
}

export function AgeCellRenderer({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return "-";

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      <span className="font-bold">{formatter.format(field)}</span>{" "}
      <span className="text-xs">{field <= 1 ? "Year" : "Years"}</span>
    </div>
  );
}

export function BaseCellRenderer({ row, column, api }: Grid.T.CellRendererParams<GridSpec>) {
  if (api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  const field = api.columnField(column, row);

  return <div className="flex h-full w-full items-center">{(field as string) ?? "-"}</div>;
}
