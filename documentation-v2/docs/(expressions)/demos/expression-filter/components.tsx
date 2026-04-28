import type { Grid } from "@1771technologies/lytenyte-pro";
import type { GridSpec } from "./demo";
import { format, isValid, parse } from "date-fns";
import { countryFlags } from "@1771technologies/grid-sample-data/sales-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Fragment } from "react";

export function DateCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "string") return "-";

  const dateField = parse(field as string, "MM/dd/yyyy", new Date());

  if (!isValid(dateField)) return "-";

  const niceDate = format(dateField, "yyyy MMM dd");
  return <div className="flex h-full w-full items-center tabular-nums">{niceDate}</div>;
}

export function AgeGroup({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (field === "Youth (<25)") return <div className="text-[#944cec] dark:text-[#B181EB]">{field}</div>;
  if (field === "Young Adults (25-34)")
    return <div className="text-[#aa6c1a] dark:text-[#E5B474]">{field}</div>;
  if (field === "Adults (35-64)") return <div className="text-[#0f7d4c] dark:text-[#52B086]">{field}</div>;

  return "-";
}

export function GenderCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (field === "Male")
    return (
      <div className="flex h-full w-full items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/50">
          <svg width="16" height="16" fill="currentcolor" viewBox="0 0 256 256">
            <path d="M216,28H168a12,12,0,0,0,0,24h19L154.28,84.74a84,84,0,1,0,17,17L204,69V88a12,12,0,0,0,24,0V40A12,12,0,0,0,216,28ZM146.41,194.46a60,60,0,1,1,0-84.87A60.1,60.1,0,0,1,146.41,194.46Z"></path>
          </svg>
        </div>
        Male
      </div>
    );

  if (field === "Female")
    return (
      <div className="flex h-full w-full items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-pink-500/50">
          <svg width="16" height="16" fill="currentcolor" viewBox="0 0 256 256">
            <path d="M212,96a84,84,0,1,0-96,83.13V196H88a12,12,0,0,0,0,24h28v20a12,12,0,0,0,24,0V220h28a12,12,0,0,0,0-24H140V179.13A84.12,84.12,0,0,0,212,96ZM68,96a60,60,0,1,1,60,60A60.07,60.07,0,0,1,68,96Z"></path>
          </svg>
        </div>
        Female
      </div>
    );

  return "-";
}

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
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

export function CountryCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const flag = countryFlags[field as keyof typeof countryFlags];
  if (!flag) return "-";

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img className="size-4" src={flag} alt={`country flag of ${field}`} />
      <span>{String(field ?? "-")}</span>
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  string: "bg-ln-green-10 text-ln-green-70",
  number: "bg-ln-info-10 text-ln-info-70",
  boolean: "bg-ln-yellow-10 text-ln-yellow-70",
  fn: "bg-ln-primary-10 text-ln-primary-70",
  object: "bg-ln-bg-strong text-ln-text",
};

function typeTag(val: unknown): string {
  if (typeof val === "function") return "fn";
  if (Array.isArray(val)) return "array";
  if (val === null) return "null";
  return typeof val;
}

function ContextRow({ name, value, depth = 0 }: { name: string; value: unknown; depth?: number }) {
  const type = typeTag(value);
  const isObj = type === "object";
  const colorClass = TYPE_COLORS[type] ?? "bg-ln-bg-strong text-ln-text";

  let displayVal: string | null = null;
  if (type === "fn") displayVal = "() => …";
  else if (!isObj) displayVal = typeof value === "string" ? `"${value}"` : String(value);

  return (
    <div
      className="grid grid-cols-[1fr_auto] items-center gap-3 py-2 pr-3"
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      <div className="flex min-w-0 items-baseline gap-2">
        {depth > 0 && <span className="text-ln-border-strong shrink-0 select-none font-mono text-xs">↳</span>}
        <span className="text-ln-text-dark shrink-0 font-mono text-xs font-semibold">{name}</span>
        {displayVal !== null && (
          <span className="text-ln-text-light min-w-0 truncate font-mono text-xs">{displayVal}</span>
        )}
      </div>
      <span className={`shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] font-medium ${colorClass}`}>
        {type}
      </span>
    </div>
  );
}

export function ContextRows({ obj, depth = 0 }: { obj: Record<string, unknown>; depth?: number }) {
  return (
    <>
      {Object.entries(obj).map(([key, val]) => {
        const isObj = typeTag(val) === "object" && val !== null;
        return (
          <Fragment key={key}>
            <ContextRow name={key} value={val} depth={depth} />
            {isObj && <ContextRows obj={val as Record<string, unknown>} depth={depth + 1} />}
          </Fragment>
        );
      })}
    </>
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
