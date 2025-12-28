import type { GridSpec } from "./demo";
import { useMemo } from "react";
import { format } from "date-fns";
import clsx from "clsx";
import type { Grid } from "@1771technologies/lytenyte-pro-experimental";

export function DateCell({ column, row, api }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const niceDate = useMemo(() => {
    if (typeof field !== "string") return null;
    return format(field, "MMM dd, yyyy HH:mm:ss");
  }, [field]);

  // Guard against bad values and render nothing
  if (!niceDate) return null;

  return <div className="text-ln-text flex h-full w-full items-center tabular-nums">{niceDate}</div>;
}

export function StatusCell({ column, row, api }: Grid.T.CellRendererParams<GridSpec>) {
  const status = api.columnField(column, row);

  // Guard against bad values
  if (typeof status !== "number") return null;

  return (
    <div className={clsx("flex h-full w-full items-center text-xs font-bold")}>
      <div
        className={clsx(
          "rounded-sm px-1 py-px",
          status < 400 && "text-ln-primary-50 bg-[#126CFF1F]",
          status >= 400 && status < 500 && "bg-[#FF991D1C] text-[#EEA760]",
          status >= 500 && "bg-[#e63d3d2d] text-[#e63d3d]",
        )}
      >
        {status}
      </div>
    </div>
  );
}

export function MethodCell({ column, row, api }: Grid.T.CellRendererParams<GridSpec>) {
  const method = api.columnField(column, row);

  // Guard against bad values
  if (typeof method !== "string") return null;

  return (
    <div className={clsx("flex h-full w-full items-center text-xs font-bold")}>
      <div
        className={clsx(
          "rounded-sm px-1 py-px",
          method === "GET" && "text-ln-primary-50 bg-[#126CFF1F]",
          (method === "PATCH" || method === "PUT" || method === "POST") && "bg-[#FF991D1C] text-[#EEA760]",
          method === "DELETE" && "bg-[#e63d3d2d] text-[#e63d3d]",
        )}
      >
        {method}
      </div>
    </div>
  );
}

export function PathnameCell({ column, row, api }: Grid.T.CellRendererParams<GridSpec>) {
  const path = api.columnField(column, row);

  if (typeof path !== "string") return null;

  return (
    <div className="text-ln-text-dark flex h-full w-full items-center text-sm">
      <div className="text-ln-primary-50 w-full overflow-hidden text-ellipsis text-nowrap">{path}</div>
    </div>
  );
}

const numberFormatter = new Intl.NumberFormat("en-Us", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});
export function LatencyCell({ column, row, api }: Grid.T.CellRendererParams<GridSpec>) {
  const ms = api.columnField(column, row);
  if (typeof ms !== "number") return null;

  return (
    <div className="text-ln-text-dark flex h-full w-full items-center text-sm tabular-nums">
      <div>
        <span className="text-ln-gray-100">{numberFormatter.format(ms)}</span>
        <span className="text-ln-text-light text-xs">ms</span>
      </div>
    </div>
  );
}

export function RegionCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  // Only render for leaf rows and we have some data
  if (!api.rowIsLeaf(row) || !row.data) return null;

  const shortName = row.data["region.shortname"];
  const longName = row.data["region.fullname"];

  return (
    <div className="flex h-full w-full items-center">
      <div className="flex items-baseline gap-2 text-sm">
        <div className="text-ln-gray-100">{shortName}</div>
        <div className="text-ln-text-light leading-4">{longName}</div>
      </div>
    </div>
  );
}

const colors = ["var(--transfer)", "var(--dns)", "var(--connection)", "var(--ttfb)", "var(--tls)"];
export function TimingPhaseCell({ api, row }: Grid.T.CellRendererParams<GridSpec>) {
  // Guard against rows that are not leafs or rows that have no data.
  if (!api.rowIsLeaf(row) || !row.data) return;

  const total =
    row.data["timing-phase.connection"] +
    row.data["timing-phase.dns"] +
    row.data["timing-phase.tls"] +
    row.data["timing-phase.transfer"] +
    row.data["timing-phase.ttfb"];

  const connectionPer = (row.data["timing-phase.connection"] / total) * 100;
  const dnsPer = (row.data["timing-phase.dns"] / total) * 100;
  const tlPer = (row.data["timing-phase.tls"] / total) * 100;
  const transferPer = (row.data["timing-phase.transfer"] / total) * 100;
  const ttfbPer = (row.data["timing-phase.ttfb"] / total) * 100;

  const values = [connectionPer, dnsPer, tlPer, transferPer, ttfbPer];

  return (
    <div className="flex h-full w-full items-center">
      <div className="flex h-4 w-full items-center gap-px overflow-hidden">
        {values.map((v, i) => {
          return (
            <div
              key={i}
              style={{ width: `${v}%`, background: colors[i] }}
              className={clsx("h-full rounded-sm")}
            />
          );
        })}
      </div>
    </div>
  );
}
