import type { Grid } from "@1771technologies/lytenyte-pro";
import type { GridSpec } from "./demo";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

const computedFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

export function ComputedCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const value = api.columnField(column, row);

  if (value === null || value === undefined) {
    return <div className="text-ln-primary-50 flex h-full w-full items-center justify-end">—</div>;
  }

  const isNum = typeof value === "number";
  const display = isNum ? computedFormatter.format(value) : String(value);

  return (
    <div className={tw("text-ln-primary-50 flex h-full w-full items-center justify-end")}>{display}</div>
  );
}

export function ProfitCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const formatted = field < 0 ? `-$${formatter.format(Math.abs(field))}` : "$" + formatter.format(field);

  return (
    <div
      className={tw(
        "flex h-full w-full items-center justify-end tabular-nums",
        field < 0 && "text-red-600 dark:text-red-300",
        field > 0 && "text-green-600 dark:text-green-300",
      )}
    >
      {formatted}
    </div>
  );
}

export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const formatted = field < 0 ? `-$${formatter.format(Math.abs(field))}` : "$" + formatter.format(field);

  return <div className={"flex h-full w-full items-center justify-end tabular-nums"}>{formatted}</div>;
}

export function CostCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const formatted = field < 0 ? `-$${formatter.format(Math.abs(field))}` : "$" + formatter.format(field);

  return (
    <div
      className={tw(
        "flex h-full w-full items-center justify-end tabular-nums text-red-600 dark:text-red-300",
      )}
    >
      {formatted}
    </div>
  );
}

const KIND_CONFIG: Record<string, { icon: string; bg: string; text: string }> = {
  function: { icon: "ph--function", bg: "bg-ln-primary-10", text: "text-ln-primary-50" },
  string: { icon: "ph--quotes", bg: "bg-ln-green-10", text: "text-ln-green-50" },
  number: { icon: "ph--hash", bg: "bg-ln-info-10", text: "text-ln-info-50" },
  boolean: { icon: "ph--toggle-left", bg: "bg-ln-yellow-10", text: "text-ln-yellow-50" },
  object: { icon: "ph--cube", bg: "bg-ln-bg-strong", text: "text-ln-text" },
  array: { icon: "ph--brackets-square", bg: "bg-ln-yellow-10", text: "text-ln-yellow-50" },
  operator: { icon: "ph--plus-minus", bg: "bg-ln-red-10", text: "text-ln-red-50" },
};

export function KindBadge({ kind }: { kind: string }) {
  const cfg = KIND_CONFIG[kind] ?? {
    icon: "ph--question",
    bg: "bg-ln-bg-strong",
    text: "text-ln-text-light",
  };
  return (
    <span className={`flex size-5 shrink-0 items-center justify-center rounded ${cfg.bg} ${cfg.text}`}>
      <span className={`iconify ${cfg.icon} size-3.5`} />
    </span>
  );
}
