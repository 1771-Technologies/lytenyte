import type {
  CellRendererParams,
  HeaderCellRendererParams,
  RowDetailRendererParams,
  SortComparatorFn,
  SortModelItem,
} from "@1771technologies/lytenyte-pro/types";
import type { RequestData } from "./data";
import { format } from "date-fns";
import { useMemo } from "react";
import clsx from "clsx";
import { PieChart } from "react-minimal-pie-chart";
import { ArrowDownIcon, ArrowUpIcon } from "@1771technologies/lytenyte-pro/icons";

const colors = ["var(--transfer)", "var(--dns)", "var(--connection)", "var(--ttfb)", "var(--tls)"];

const customComparators: Record<string, SortComparatorFn<RequestData>> = {
  region: (left, right) => {
    if (left.kind === "branch" || right.kind === "branch") {
      if (left.kind === "branch" && right.kind === "branch") return 0;
      if (left.kind === "branch" && right.kind !== "branch") return -1;
      if (left.kind !== "branch" && right.kind === "branch") return 1;
    }
    if (!left.data || !right.data) return !left.data ? 1 : -1;

    const leftData = left.data as RequestData;
    const rightData = right.data as RequestData;

    return leftData["region.fullname"].localeCompare(rightData["region.fullname"]);
  },
  "timing-phase": (left, right) => {
    if (left.kind === "branch" || right.kind === "branch") {
      if (left.kind === "branch" && right.kind === "branch") return 0;
      if (left.kind === "branch" && right.kind !== "branch") return -1;
      if (left.kind !== "branch" && right.kind === "branch") return 1;
    }
    if (!left.data || !right.data) return !left.data ? 1 : -1;

    const leftData = left.data as RequestData;
    const rightData = right.data as RequestData;

    return leftData.Latency - rightData.Latency;
  },
};

export function Header({ column, grid }: HeaderCellRendererParams<RequestData>) {
  const sort = grid.state.sortModel.useValue().find((c) => c.columnId === column.id);

  const isDescending = sort?.isDescending ?? false;

  return (
    <div
      className="text-ln-gray-60 flex h-full w-full items-center px-4 text-sm transition-all"
      onClick={() => {
        const current = grid.api.sortForColumn(column.id);

        if (current == null) {
          let sort: SortModelItem<RequestData>;
          const columnId = column.id;

          if (customComparators[column.id]) {
            sort = {
              columnId,
              sort: {
                kind: "custom",
                columnId,
                comparator: customComparators[column.id],
              },
            };
          } else if (column.type === "datetime") {
            sort = {
              columnId,
              sort: { kind: "date", options: { includeTime: true } },
            };
          } else if (column.type === "number") {
            sort = { columnId, sort: { kind: "number" } };
          } else {
            sort = { columnId, sort: { kind: "string" } };
          }

          grid.state.sortModel.set([sort]);
          return;
        }
        if (!current.sort.isDescending) {
          grid.state.sortModel.set([{ ...current.sort, isDescending: true }]);
        } else {
          grid.state.sortModel.set([]);
        }
      }}
    >
      {column.name ?? column.id}

      {sort && (
        <>
          {!isDescending ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
        </>
      )}
    </div>
  );
}

export function DateCell({ column, row, grid }: CellRendererParams<RequestData>) {
  const field = grid.api.columnField(column, row);

  const niceDate = useMemo(() => {
    if (typeof field !== "string") return null;
    return format(field, "MMM dd, yyyy HH:mm:ss");
  }, [field]);

  // Guard against bad values and render nothing
  if (!niceDate) return null;

  return <div className="text-ln-gray-100 flex h-full w-full items-center px-4">{niceDate}</div>;
}

export function StatusCell({ column, row, grid }: CellRendererParams<RequestData>) {
  const status = grid.api.columnField(column, row);

  // Guard against bad values
  if (typeof status !== "number") return null;

  return (
    <div className={clsx("flex h-full w-full items-center px-4 text-xs font-bold")}>
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

export function MethodCell({ column, row, grid }: CellRendererParams<RequestData>) {
  const method = grid.api.columnField(column, row);

  // Guard against bad values
  if (typeof method !== "string") return null;

  return (
    <div className={clsx("flex h-full w-full items-center px-4 text-xs font-bold")}>
      <div
        className={clsx(
          "rounded-sm px-1 py-px",
          method === "GET" && "text-ln-primary-50 bg-[#126CFF1F]",
          (method === "PATCH" || method === "PUT" || method === "POST") &&
            "bg-[#FF991D1C] text-[#EEA760]",
          method === "DELETE" && "bg-[#e63d3d2d] text-[#e63d3d]",
        )}
      >
        {method}
      </div>
    </div>
  );
}

export function PathnameCell({ column, row, grid }: CellRendererParams<RequestData>) {
  const path = grid.api.columnField(column, row);

  if (typeof path !== "string") return null;

  return (
    <div className="text-ln-gray-90 flex h-full w-full items-center px-4 text-sm">
      <div className="text-ln-primary-50 w-full overflow-hidden text-ellipsis text-nowrap">
        {path}
      </div>
    </div>
  );
}

const numberFormatter = new Intl.NumberFormat("en-Us", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});
export function LatencyCell({ column, row, grid }: CellRendererParams<RequestData>) {
  const ms = grid.api.columnField(column, row);
  if (typeof ms !== "number") return null;

  return (
    <div className="text-ln-gray-90 flex h-full w-full items-center px-4 text-sm tabular-nums">
      <div>
        <span className="text-ln-gray-100">{numberFormatter.format(ms)}</span>
        <span className="text-ln-gray-60 text-xs">ms</span>
      </div>
    </div>
  );
}

export function RegionCell({ grid, row }: CellRendererParams<RequestData>) {
  // Only render for leaf rows and we have some data
  if (!grid.api.rowIsLeaf(row) || !row.data) return null;

  const shortName = row.data["region.shortname"];
  const longName = row.data["region.fullname"];

  return (
    <div className="flex h-full w-full items-center">
      <div className="flex items-baseline gap-2 px-4 text-sm">
        <div className="text-ln-gray-100">{shortName}</div>
        <div className="text-ln-gray-60 leading-4">{longName}</div>
      </div>
    </div>
  );
}

export function TimingPhaseCell({ grid, row }: CellRendererParams<RequestData>) {
  // Guard against rows that are not leafs or rows that have no data.
  if (!grid.api.rowIsLeaf(row) || !row.data) return;

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
    <div className="flex h-full w-full items-center px-4">
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

export function RowDetailRenderer({ row, grid }: RowDetailRendererParams<RequestData>) {
  // Guard against empty data.
  if (!grid.api.rowIsLeaf(row) || !row.data) return null;

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

  return (
    <div className="flex h-full flex-col px-4 py-8 text-sm">
      <h3 className="text-ln-gray-60 mt-0 text-xs font-[500]">Timing Phases</h3>

      <div className="flex flex-1 gap-2 pt-[6px]">
        <div className="bg-ln-gray-00 border-ln-gray-20 h-full flex-1 rounded-[10px] border">
          <div className="grid-cols[auto_auto_1fr] grid grid-rows-5 gap-1 gap-x-4 p-4 md:grid-cols-[auto_auto_200px_auto]">
            <TimingPhaseRow
              label="Transfer"
              color={colors[0]}
              msPercentage={transferPer}
              msValue={row.data["timing-phase.transfer"]}
            />
            <TimingPhaseRow
              label="DNS"
              color={colors[1]}
              msPercentage={dnsPer}
              msValue={row.data["timing-phase.dns"]}
            />
            <TimingPhaseRow
              label="Connection"
              color={colors[2]}
              msPercentage={connectionPer}
              msValue={row.data["timing-phase.connection"]}
            />
            <TimingPhaseRow
              label="TTFB"
              color={colors[3]}
              msPercentage={ttfbPer}
              msValue={row.data["timing-phase.ttfb"]}
            />
            <TimingPhaseRow
              label="TLS"
              color={colors[4]}
              msPercentage={tlPer}
              msValue={row.data["timing-phase.tls"]}
            />

            <div className="col-start-3 row-span-full flex h-full flex-1 items-center justify-center">
              <TimingPhasePieChart row={row.data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TimePhaseRowProps {
  readonly color: string;
  readonly msValue: number;
  readonly msPercentage: number;
  readonly label: string;
}

function TimingPhaseRow({ color, msValue, msPercentage, label }: TimePhaseRowProps) {
  return (
    <>
      <div className="text-sm">{label}</div>
      <div className="text-sm tabular-nums">{msPercentage.toFixed(2)}%</div>
      <div className="col-start-4 hidden items-center justify-end gap-1 text-sm md:flex">
        <div>
          <span className="text-ln-gray-100">{numberFormatter.format(msValue)}</span>
          <span className="text-ln-gray-60 text-xs">ms</span>
        </div>
        <div
          className="rounded"
          style={{
            width: `${msValue}px`,
            height: "12px",
            background: color,
            display: "block",
          }}
        ></div>
      </div>
    </>
  );
}

function TimingPhasePieChart({ row }: { row: RequestData }) {
  const data = useMemo(() => {
    return [
      { subject: "Transfer", value: row["timing-phase.transfer"], color: colors[0] },
      { subject: "DNS", value: row["timing-phase.dns"], color: colors[1] },
      { subject: "Connection", value: row["timing-phase.connection"], color: colors[2] },
      { subject: "TTFB", value: row["timing-phase.ttfb"], color: colors[3] },
      { subject: "TLS", value: row["timing-phase.tls"], color: colors[4] },
    ];
  }, [row]);

  return (
    <div style={{ height: 100 }}>
      <PieChart data={data} startAngle={180} lengthAngle={180} center={[50, 75]} paddingAngle={1} />
    </div>
  );
}
