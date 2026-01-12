import "@1771technologies/lytenyte-pro-experimental/components.css";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { exchanges, networks, symbols } from "@1771technologies/grid-sample-data/dex-pairs-performance";
import { Tooltip } from "radix-ui";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo";

export function SymbolCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const ticker = row.data.symbolTicker;
  const symbol = row.data.symbol;
  const image = symbols[row.data.symbolTicker];

  return (
    <Tooltip.Root delayDuration={100}>
      <Tooltip.Trigger asChild className="h-ful w-full">
        <div className="grid grid-cols-[20px_auto_1fr] items-center gap-1.5">
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
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content className="border-ln-border bg-ln-bg-popover z-20 grid grid-cols-[20px_1fr] items-center gap-1.5 rounded border p-2">
          <div>
            <img
              src={networks[row.data.network]}
              alt={`Logo for network ${row.data.network}`}
              className="h-full w-full overflow-hidden rounded-full"
            />
          </div>
          <div className="w-full overflow-hidden text-ellipsis">{row.data.network}</div>
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
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
