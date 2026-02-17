import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { exchanges, networks, symbols } from "@1771technologies/grid-sample-data/dex-pairs-performance";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
import type { Grid } from "@1771technologies/lytenyte-pro";
import type { GridSpec } from "./demo";
import type { SVGProps } from "react";

export function SymbolCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const ticker = row.data.symbolTicker;
  const symbol = row.data.symbol;
  const image = symbols[row.data.symbolTicker];

  return (
    <div className="grid grid-cols-[20px_auto_auto] items-center gap-1.5">
      <div>
        <img
          src={image}
          alt={`Logo for symbol ${symbol}`}
          className="h-full w-full overflow-hidden rounded-full"
        />
      </div>
      <div className="bg-ln-gray-20 text-ln-text-dark flex h-fit items-center justify-center rounded-lg px-2 py-px text-[10px]">
        {ticker}
      </div>
      <div className="w-full overflow-hidden text-ellipsis">{symbol.split("/")[0]}</div>
    </div>
  );
}

export function NetworkCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const name = row.data.network;
  const image = networks[name];

  return (
    <div className="grid grid-cols-[20px_1fr] items-center gap-1.5">
      <div>
        <img
          src={image}
          alt={`Logo for network ${name}`}
          className="h-full w-full overflow-hidden rounded-full"
        />
      </div>
      <div className="w-full overflow-hidden text-ellipsis">{name}</div>
    </div>
  );
}

export function ExchangeCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const name = row.data.exchange;
  const image = exchanges[name];

  return (
    <div className="grid grid-cols-[20px_1fr] items-center gap-1.5">
      <div>
        <img
          src={image}
          alt={`Logo for exchange ${name}`}
          className="h-full w-full overflow-hidden rounded-full"
        />
      </div>
      <div className="w-full overflow-hidden text-ellipsis">{name}</div>
    </div>
  );
}

export function PercentCellPositiveNegative({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const value = (field > 0 ? "+" : "") + (field * 100).toFixed(2) + "%";

  return (
    <div
      className={tw(
        "h-ful flex w-full items-center justify-end tabular-nums",
        field < 0 ? "text-red-600 dark:text-red-300" : "text-green-600 dark:text-green-300",
      )}
    >
      {value}
    </div>
  );
}

export function PercentCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const value = (field > 0 ? "+" : "") + (field * 100).toFixed(2) + "%";

  return <div className="h-ful flex w-full items-center justify-end tabular-nums">{value}</div>;
}

export const makePerfHeaderCell = (name: string, subname: string) => {
  return (_: Grid.T.HeaderParams<GridSpec>) => {
    return (
      <div className="flex h-full w-full flex-col items-end justify-center tabular-nums">
        <div>{name}</div>
        <div className="text-ln-text-light font-mono uppercase">{subname}</div>
      </div>
    );
  };
};

export const DragIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 20 21" {...props}>
    <path
      stroke="#676D80"
      strokeDasharray="0.11 2.63"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={1.578}
      d="M12.526 3.71v0c0-1.04-.843-1.883-1.883-1.883H4.11a2.104 2.104 0 0 0-2.104 2.104v6.422c0 1.1.892 1.993 1.993 1.993v0"
    />
    <path
      stroke="#676D80"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.578}
      d="M13.183 17.081c-.39.831-1.596.758-1.884-.113l-1.868-5.652a1.016 1.016 0 0 1 1.283-1.284l5.652 1.869c.872.288.944 1.494.113 1.884l-1.91.899c-.214.1-.386.273-.487.487z"
    />
    <path
      stroke="#676D80"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.578}
      d="M15.519 8.3v-.986a2.104 2.104 0 0 0-2.104-2.104H7.104A2.104 2.104 0 0 0 5 7.314v6.31c0 1.163.942 2.105 2.104 2.105h.377"
    />
  </svg>
);
