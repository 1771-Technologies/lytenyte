import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import { memo } from "react";
import { logos } from "@1771technologies/grid-sample-data/stock-data-smaller";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { GridSpec } from "./demo";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

function CompactNumberCellImpl({ row, api, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return <CompactNumberLabel value={field as string} />;
}

export function CompactNumberLabel({ value }: { value: string | number }) {
  const [label, suffix] = typeof value === "number" ? formatCompactNumber(value) : ["-", ""];

  return (
    <div className="text-ln-text-dark flex h-full w-full items-center justify-end gap-1 text-nowrap tabular-nums">
      <span>{label}</span>
      <span className="font-semibold">{suffix}</span>
    </div>
  );
}

export const CompactNumberCell = memo(CompactNumberCellImpl);
function formatCompactNumber(n: number) {
  const suffixes = ["", "K", "M", "B", "T"];
  let magnitude = 0;
  let num = Math.abs(n);

  while (num >= 1000 && magnitude < suffixes.length - 1) {
    num /= 1000;
    magnitude++;
  }

  const decimals = 2;
  const formatted = num.toFixed(decimals);

  return [`${n < 0 ? "-" : ""}${formatted}`, suffixes[magnitude]];
}

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function CurrencyCellImpl({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const label = typeof field === "number" ? formatter.format(field) : "-";

  return (
    <div className="flex h-full w-full items-center justify-end text-nowrap tabular-nums">
      <CurrencyLabel value={label} />
    </div>
  );
}

export function CurrencyLabel({ value }: { value: number | string }) {
  return (
    <div className="text-ln-text-dark flex items-baseline gap-1">
      <span>{typeof value === "number" ? formatter.format(value) : value}</span>
      <span className="text-[9px]">USD</span>
    </div>
  );
}

export const CurrencyCell = memo(CurrencyCellImpl);

function PercentCellImpl({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row) as number;

  return <PercentLabel value={field} />;
}

export function PercentLabel({ value }: { value: string | number }) {
  const label = typeof value === "number" ? formatter.format(value) + "%" : "-";

  return (
    <div
      className={tw("text-ln-text-dark flex h-full w-full items-center justify-end text-nowrap tabular-nums")}
    >
      {label}
    </div>
  );
}

export const PercentCell = memo(PercentCellImpl);

function SymbolCellImpl({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row)) return null;

  const symbol = api.columnField(column, row) as string;
  const desc = row.data?.[1];

  return (
    <div className="text-ln-text-dark grid h-full w-full grid-cols-[32px_1fr] items-center gap-3 overflow-hidden text-nowrap">
      <div className="flex h-8 min-h-8 w-8 min-w-8 items-center justify-center overflow-hidden rounded-full">
        <img
          src={logos[symbol]}
          alt=""
          width={26}
          height={26}
          className="h-6.5 min-h-6.5 w-6.5 pointer-events-none min-w-[26] rounded-full bg-black p-1"
        />
      </div>
      <div className="overflow-hidden text-ellipsis">{desc}</div>
    </div>
  );
}
export const SymbolCell = memo(SymbolCellImpl);
