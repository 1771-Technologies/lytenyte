import "./component.css";
import { logos } from "@1771technologies/grid-sample-data/stock-data-smaller";
import { useEffect, useMemo, useRef } from "react";

import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function NumberCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row) as number;

  const prevValue = useRef(field);

  const diff = useMemo(() => {
    if (prevValue.current === field) return 0;

    const diff = field - prevValue.current;
    prevValue.current = field;

    return diff;
  }, [field]);

  const value = typeof field === "number" ? formatter.format(field) : "-";

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const parent = ref.current?.parentElement;
    if (!parent || !diff) return;

    parent.style.animation = "none";
    requestAnimationFrame(() => {
      parent.style.animation = "flash 1s ease-out forwards";
    });
  }, [diff]);

  return (
    <div ref={ref} className="flex h-full items-center justify-end gap-2 tabular-nums tracking-tighter">
      {value}
    </div>
  );
}

function CaretRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentcolor" viewBox="0 0 256 256">
      <path d="M181.66,133.66l-80,80A8,8,0,0,1,88,208V48a8,8,0,0,1,13.66-5.66l80,80A8,8,0,0,1,181.66,133.66Z"></path>
    </svg>
  );
}

export function GroupCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (api.rowIsGroup(row)) {
    const symbol = row.key;

    const isExpanded = row.expanded;

    return (
      <div className="flex h-full w-full items-center gap-2 overflow-hidden text-nowrap px-3">
        <button
          className={tw(
            "hover:bg-ln-gray-10 w-5 cursor-pointer rounded transition-colors",
            isExpanded && "rotate-90",
          )}
          onClick={() => {
            api.rowGroupToggle(row);
          }}
        >
          <span className="sr-only">Toggle the row group</span>
          <CaretRight />
        </button>
        <div className="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center overflow-hidden rounded-full">
          <img
            src={logos[symbol!]}
            alt={`Logo of `}
            className="h-6.5 min-h-6.5 w-6.5 min-w-[26] rounded-full bg-black p-1"
          />
        </div>
        <div className="symbol-cell min-w-15 flex items-center justify-center rounded-2xl bg-teal-600/20 px-1 py-0.5 text-xs">
          {symbol}
        </div>
      </div>
    );
  }
  if (!api.rowIsLeaf(row)) return null;

  const symbol = row.data?.["symbol"] as string;

  return (
    <div className="flex h-full w-full items-center justify-end gap-3 overflow-hidden text-nowrap px-3">
      <div className="symbol-cell min-w-15 flex items-center justify-center rounded-2xl px-1 py-0.5 text-xs opacity-50">
        {symbol}
      </div>
    </div>
  );
}

export const HeaderCell = ({ column }: Grid.T.HeaderParams<GridSpec>) => {
  const aggName = column.agg;

  return (
    <div
      className={clsx(
        "flex h-full w-full items-center gap-2 text-sm",
        column.type === "number" && "flex-row-reverse",
      )}
    >
      <div>{column.name ?? column.id}</div>
      {aggName && (
        <span className="focus-visible:ring-ln-primary-50 text-ln-primary-50 rounded px-1 py-1 text-[10px] text-xs focus:outline-none focus-visible:ring-1">
          ({aggName as string})
        </span>
      )}
    </div>
  );
};
