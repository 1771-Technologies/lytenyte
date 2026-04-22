import type { Grid } from "@1771technologies/lytenyte-pro";
import type { GridSpec } from "./demo";

const formatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function MoneyCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const value = api.columnField(column, row);
  if (typeof value !== "number") return <div className="flex h-full items-center px-2">—</div>;
  return (
    <div
      className={`flex h-full items-center justify-end px-2 tabular-nums ${
        value < 0 ? "text-red-500 dark:text-red-400" : ""
      }`}
    >
      ${formatter.format(value)}
    </div>
  );
}

export function ComputedCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const value = api.columnField(column, row);

  if (value === null || value === undefined) {
    return (
      <div className="text-ln-text-xlight flex h-full items-center justify-end px-2 font-mono text-xs">
        —
      </div>
    );
  }

  const isNum = typeof value === "number";
  const display = isNum ? formatter.format(value) : String(value);

  return (
    <div
      className={`flex h-full items-center justify-end px-2 font-mono text-xs font-medium tabular-nums ${
        isNum && (value as number) < 0
          ? "text-red-500 dark:text-red-400"
          : "text-ln-primary-60 dark:text-ln-primary-40"
      }`}
    >
      {display}
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
