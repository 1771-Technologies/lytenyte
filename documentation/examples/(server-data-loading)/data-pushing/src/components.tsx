import "./component.css";
import type {
  CellRendererParams,
  HeaderCellRendererFn,
} from "@1771technologies/lytenyte-pro/types";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { usePrevious } from "@uidotdev/usehooks";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import type { DataEntry } from "./data";
import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function NumberCell({ grid, column, row }: CellRendererParams<DataEntry>) {
  const field = grid.api.columnField(column, row) as number;

  const prev = usePrevious(field);

  const value = typeof field === "number" ? formatter.format(field) : "-";

  const diff = field - (prev ?? field);

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;

    ref.current.style.animation = "none";
    void ref.current.offsetWidth;
    ref.current.style.animation = "fadeOut 3s ease-out forwards";
  }, [diff]);

  return (
    <div
      className={clsx(
        "flex h-full items-center justify-end gap-2 px-2 font-mono tabular-nums tracking-tighter",
      )}
    >
      {diff !== 0 && (
        <div
          ref={ref}
          className={clsx(
            "flex items-center rounded px-1 text-[10px]",
            diff < 0 && "bg-red-800/20 text-red-500",
            diff > 0 && "bg-green-500/20 text-green-500",
          )}
        >
          {diff < 0 && <ArrowDownIcon width={12} height={12} />}
          {diff > 0 && <ArrowUpIcon width={12} height={12} />}
          <span>{diff.toFixed(2)}</span>
        </div>
      )}

      {value}
    </div>
  );
}

export function GroupCell({ grid, row }: CellRendererParams<DataEntry>) {
  if (grid.api.rowIsGroup(row)) {
    const symbol = row.key;

    const isExpanded = grid.api.rowGroupIsExpanded(row);

    return (
      <div className="flex h-full w-full items-center gap-2 overflow-hidden text-nowrap px-3">
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
        <div className="flex h-[32px] min-h-[32px] w-[32px] min-w-[32px] items-center justify-center overflow-hidden rounded-full">
          <img
            src={`/symbols/${symbol}.png`}
            alt=""
            className="h-[26px] min-h-[26px] w-[26px] min-w-[26] rounded-full bg-black p-1"
          />
        </div>
        <div className="symbol-cell flex min-w-[60px] items-center justify-center rounded-2xl bg-teal-600/20 px-1 py-0.5 text-xs">
          {symbol}
        </div>
      </div>
    );
  }
  if (!grid.api.rowIsLeaf(row)) return null;

  const symbol = row.data?.["symbol"] as string;

  return (
    <div className="flex h-full w-full items-center justify-end gap-3 overflow-hidden text-nowrap px-3">
      <div className="symbol-cell flex min-w-[60px] items-center justify-center rounded-2xl px-1 py-0.5 text-xs opacity-50">
        {symbol}
      </div>
    </div>
  );
}

export const HeaderCell: HeaderCellRendererFn<DataEntry> = ({ grid, column }) => {
  const aggs = grid.state.aggModel.useValue();
  const agg = aggs[column.id];
  const aggFn = column.id === "spread" ? "diff" : agg?.fn;
  const aggName = typeof aggFn === "string" ? aggFn : "Fn(x)";

  return (
    <div
      className={clsx(
        "flex h-full w-full items-center gap-2 text-sm text-[var(--lng1771-gray-80)]",
        column.type === "number" && "flex-row-reverse",
      )}
    >
      <div>{column.name ?? column.id}</div>
      {aggFn && aggFn !== "group" && (
        <span className="focus-visible:ring-ln-primary-50 rounded px-1 py-1 text-xs text-[var(--lng1771-primary-50)] focus:outline-none focus-visible:ring-1">
          ({aggName as string})
        </span>
      )}
    </div>
  );
};

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
