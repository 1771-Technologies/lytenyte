import { type Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo.js";
import { twMerge } from "tailwind-merge";
import clsx, { type ClassValue } from "clsx";
import { countryFlags, nameToAvatar } from "@1771technologies/grid-sample-data/loan-data";
import { useId, useMemo } from "react";
import { format, isValid, parse } from "date-fns";

export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const prefix = api.rowIsGroup(row) && column.agg === "count" ? "" : "$";

  const formatted = field < 0 ? `-$${formatter.format(Math.abs(field))}` : prefix + formatter.format(field);

  return (
    <div
      className={tw(
        "flex h-full w-full items-center justify-end tabular-nums",
        prefix && field < 0 && "text-red-600 dark:text-red-300",
        prefix && field > 0 && "text-green-600 dark:text-green-300",
      )}
    >
      {formatted}
    </div>
  );
}

export function TextCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number")
    return <div className="flex w-full items-center justify-end px-2">{field}</div>;

  return String(field);
}

export function NameCell({ api, column, row }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number")
    return <div className="flex w-full items-center justify-end px-2">{field}</div>;

  if (typeof field !== "string") return "-";

  const url = nameToAvatar[field];

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img className="border-ln-border-strong h-7 w-7 rounded-full border" src={url} alt={field} />
      <div className="text-ln-text-dark flex flex-col gap-0.5">
        <div>{field}</div>
      </div>
    </div>
  );
}

export function AgeCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? `${formatter.format(field)}` : `${field ?? "-"}`;
}

export function DurationCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const prefix = api.rowIsGroup(row) && column.agg === "count" ? "" : "days";

  return typeof field === "number" ? `${formatter.format(field)} ${prefix}` : `${field ?? "-"}`;
}

export function CountryCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number")
    return <div className="flex w-full items-center justify-end px-2">{field}</div>;

  const flag = countryFlags[field as keyof typeof countryFlags];
  if (!flag) return "-";

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img className="size-4" src={flag} alt={`country flag of ${field}`} />
      <span>{String(field ?? "-")}</span>
    </div>
  );
}

export function DateCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number")
    return <div className="flex w-full items-center justify-end px-2">{field}</div>;

  if (typeof field !== "string") return "-";

  const dateField = parse(field as string, "yyyy-MM-dd", new Date());

  if (!isValid(dateField)) return "-";

  const niceDate = format(dateField, "yyyy MMM dd");
  return <div className="flex h-full w-full items-center tabular-nums">{niceDate}</div>;
}

export function OverdueCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number")
    return <div className="flex w-full items-center justify-end px-2">{field}</div>;

  if (field !== "Yes" && field !== "No") return "-";

  return (
    <div
      className={tw(
        "flex w-full items-center justify-center rounded-lg py-1 font-bold",
        field === "No" && "bg-green-500/10 text-green-600",
        field === "Yes" && "bg-red-500/10 text-red-400",
      )}
    >
      {field}
    </div>
  );
}

export function CustomerRating({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);
  if (typeof field !== "number") return String(field ?? "-");

  if (api.rowIsGroup(row) && column.agg !== "avg") {
    return <div className="flex items-center justify-end">{field}</div>;
  }

  return (
    <div className="flex justify-center text-yellow-300">
      <StarRating value={field} />
    </div>
  );
}

export default function StarRating({ value = 0 }: { value: number }) {
  const uid = useId();

  const max = 5;

  const clamped = useMemo(() => {
    const n = Number.isFinite(value) ? value : 0;
    return Math.max(0, Math.min(max, n));
  }, [value, max]);

  const stars = useMemo(() => {
    return Array.from({ length: max }, (_, i) => {
      const fill = Math.max(0, Math.min(1, clamped - i)); // 0..1
      return { i, fill };
    });
  }, [clamped, max]);

  return (
    <div className={"inline-flex items-center"} role="img">
      {stars.map(({ i, fill }) => {
        const gradId = `${uid}-star-${i}`;
        return <StarIcon key={i} fillFraction={fill} gradientId={gradId} />;
      })}
    </div>
  );
}

function StarIcon({ fillFraction, gradientId }: { fillFraction: number; gradientId: string }) {
  const pct = Math.round(fillFraction * 100);

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${pct}%`} stopColor="currentColor" />
          <stop offset={`${pct}%`} stopColor="transparent" />
        </linearGradient>
      </defs>

      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={`url(#${gradientId})`}
      />
      {/* Optional outline for crisp edges */}
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill="none"
        stroke="transparent"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}
