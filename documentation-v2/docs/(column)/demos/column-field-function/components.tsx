import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import { memo, type ReactNode } from "react";
import { logos } from "@1771technologies/grid-sample-data/stock-data-smaller";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import type { GridSpec } from "./demo";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

function AnalystRatingCellImpl({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row) as string;

  let Icon: (() => ReactNode) | null = null;
  const label = field || "-";
  let clx = "";
  if (label === "Strong buy") {
    Icon = StrongBuy;
    clx = "text-green-500";
  } else if (label === "Strong Sell") {
    Icon = StrongSell;
    clx = "text-red-500";
  } else if (label === "Neutral") {
    Icon = Minus;
  } else if (label === "Buy") {
    Icon = Buy;
    clx = "text-green-500";
  } else if (label === "Sell") {
    Icon = Sell;
    clx = "text-red-500";
  }

  return (
    <div className={tw("grid h-full grid-cols-[16px_1fr] items-center gap-4 text-nowrap", clx)}>
      {Icon && <Icon />}
      <div>{label}</div>
    </div>
  );
}

function Minus() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
  );
}

function Sell() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function Buy() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
    </svg>
  );
}

function StrongSell() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
      />
    </svg>
  );
}

function StrongBuy() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={16}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
    </svg>
  );
}

export const AnalystRatingCell = memo(AnalystRatingCellImpl);

function CompactNumberCellImpl({ row, api, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);
  const [label, suffix] = typeof field === "number" ? formatCompactNumber(field) : ["-", ""];

  return (
    <div className="flex h-full w-full items-center justify-end gap-1 text-nowrap tabular-nums">
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
      <div className="flex items-baseline gap-1">
        <span>{label}</span>
        <span className="text-[9px]">USD</span>
      </div>
    </div>
  );
}

export const CurrencyCell = memo(CurrencyCellImpl);

function CurrencyCellGBPImpl({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const label = typeof field === "number" ? formatter.format(field) : "-";

  return (
    <div className="flex h-full w-full items-center justify-end text-nowrap tabular-nums">
      <div className="flex items-baseline gap-1">
        <span>{label}</span>
        <span className="text-[9px]">GBP</span>
      </div>
    </div>
  );
}

export const CurrencyCellGBP = memo(CurrencyCellGBPImpl);

function PercentCellImpl({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row) as number;

  const label = typeof field === "number" ? formatter.format(field) + "%" : "-";

  return (
    <div className={tw("flex h-full w-full items-center justify-end text-nowrap tabular-nums")}>{label}</div>
  );
}

export const PercentCell = memo(PercentCellImpl);

function SymbolCellImpl({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  if (!api.rowIsLeaf(row)) return null;

  const symbol = api.columnField(column, row) as string;
  const desc = row.data?.[1];

  return (
    <div className="grid h-full w-full grid-cols-[32px_1fr] items-center gap-3 overflow-hidden text-nowrap">
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
