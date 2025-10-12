import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";
import type { CellRendererParams } from "@1771technologies/lytenyte-pro/types";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { format } from "date-fns";
import type { CSSProperties } from "react";
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

export function LastModified({ column, row, grid }: CellRendererParams<any>) {
  if (!grid.api.rowIsLeaf(row)) return null;

  const value = grid.api.columnField(column, row);

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      {format(value as string, "dd MMM yyyy hh:mm:ss")}
    </div>
  );
}

export function SizeRenderer({ column, row, grid }: CellRendererParams<any>) {
  if (!grid.api.rowIsLeaf(row)) return null;

  const value = grid.api.columnField(column, row);

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      {formatKBtoMB(value as number)} <span className="text-xs">MB</span>
    </div>
  );
}

export function GroupCellRenderer({ row, grid }: CellRendererParams<any>) {
  if (grid.api.rowIsLeaf(row)) {
    return (
      <div
        style={
          {
            paddingLeft: row.data.depth * 16 + 26,
            "--before-offset": `${row.data.depth * 16 - 5}px`,
          } as CSSProperties
        }
        className={tw(
          "relative flex h-full w-full items-center gap-2 overflow-hidden text-nowrap font-bold",
          row.data.depth > 0 &&
            "before:border-ln-gray-30 before:absolute before:left-[var(--before-offset)] before:top-0 before:h-full before:border-r before:border-dashed",
        )}
      >
        {row.data.name}
      </div>
    );
  }

  const isExpanded = grid.api.rowGroupIsExpanded(row);

  return (
    <div
      style={
        {
          paddingLeft: row.depth * 16,
          "--before-offset": `${row.depth * 16 - 5}px`,
        } as CSSProperties
      }
      className={tw(
        "relative flex h-full w-full items-center gap-2 overflow-hidden text-nowrap",
        row.depth > 0 &&
          "before:border-ln-gray-30 before:absolute before:left-[var(--before-offset)] before:top-0 before:h-full before:border-r before:border-dashed",
      )}
    >
      {row.loadingGroup && (
        <div className="w-5">
          <LoadingSpinner />
        </div>
      )}
      {!row.loadingGroup && (
        <button
          className="hover:bg-ln-gray-10 w-5 cursor-pointer rounded transition-colors"
          onClick={() => {
            grid.api.rowGroupToggle(row);
          }}
        >
          <span className="sr-only">Toggle the row group</span>
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
      )}
      <div className="w-full overflow-hidden text-ellipsis">{row.key || "(none)"}</div>
    </div>
  );
}

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <svg
        className="h-4 w-4 animate-spin text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </div>
  );
};
