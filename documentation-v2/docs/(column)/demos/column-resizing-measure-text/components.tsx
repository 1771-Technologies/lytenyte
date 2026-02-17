import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { exchanges, networks, symbols } from "@1771technologies/grid-sample-data/dex-pairs-performance";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
import { measureText, type Grid } from "@1771technologies/lytenyte-pro";
import type { GridSpec } from "./demo";
import { useId, useMemo, type CSSProperties } from "react";
import { Switch } from "radix-ui";

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

export function PercentCellPositiveNegative({
  api,
  column,
  colIndex,
  row,
}: Grid.T.CellRendererParams<GridSpec>) {
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
      <HashedValue value={value} api={api} columnIndex={colIndex} />
    </div>
  );
}

export function PercentCell({ api, colIndex, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const value = (field > 0 ? "+" : "") + (field * 100).toFixed(2) + "%";

  return (
    <div className="flex h-full w-full items-center justify-end tabular-nums">
      <HashedValue value={value} api={api} columnIndex={colIndex} />
    </div>
  );
}

function HashedValue({
  value,
  columnIndex,
  api,
}: {
  value: string;
  columnIndex: number;
  api: Grid.API<GridSpec>;
}) {
  const widths = api.xPositions$.useValue();

  const width = widths[columnIndex + 1] - widths[columnIndex];
  const measuredWidth = useMemo(() => {
    const m = measureText(value, api.viewport()!);

    return m?.width ?? 100;
  }, [api, value]);

  // Minus 6 as slight adjustment so we know there is definitely enough space
  if (measuredWidth > width - 6) return "#".repeat(Math.ceil(width / 16) + 1);

  return value;
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

export function SwitchToggle(props: { label: string; checked: boolean; onChange: (b: boolean) => void }) {
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label className="text-ln-text-dark text-sm leading-none" htmlFor={id}>
        {props.label}
      </label>
      <Switch.Root
        className="bg-ln-gray-10 data-[state=checked]:bg-ln-primary-50 h-5.5 w-9.5 border-ln-border-strong relative cursor-pointer rounded-full border outline-none"
        id={id}
        checked={props.checked}
        onCheckedChange={(c) => props.onChange(c)}
        style={{ "-webkit-tap-highlight-color": "rgba(0, 0, 0, 0)" } as CSSProperties}
      >
        <Switch.Thumb className="size-4.5 block translate-x-0.5 rounded-full bg-white/95 shadow transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-white" />
      </Switch.Root>
    </div>
  );
}
