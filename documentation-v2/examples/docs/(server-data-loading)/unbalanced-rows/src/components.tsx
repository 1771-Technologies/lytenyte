import type { Grid } from "@1771technologies/lytenyte-pro";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

const formatter = new Intl.NumberFormat("en-Us", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
function formatKBtoMB(kb: number) {
  if (isNaN(kb) || kb < 0) return "0";

  const mb = kb / 1024;
  const formatted = formatter.format(mb);

  // Add commas for readability
  return `${Number(formatted).toLocaleString()}`;
}

export function LastModified({ column, row, api }: Grid.T.CellRendererParams<{ data: any }>) {
  if (!api.rowIsLeaf(row)) return null;

  const value = api.columnField(column, row);

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      {format(value as string, "dd MMM yyyy hh:mm:ss")}
    </div>
  );
}

export function SizeRenderer({ column, row, api }: Grid.T.CellRendererParams<{ data: any }>) {
  if (!api.rowIsLeaf(row)) return null;

  const value = api.columnField(column, row);

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      {formatKBtoMB(value as number)} <span className="text-xs">MB</span>
    </div>
  );
}
