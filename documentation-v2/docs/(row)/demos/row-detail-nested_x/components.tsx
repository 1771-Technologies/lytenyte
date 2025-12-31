import type {
  CellRendererParams,
  HeaderCellRendererParams,
  RowDetailRendererParams,
  SortComparatorFn,
  SortModelItem,
} from "@1771technologies/lytenyte-pro/types";
import type { RequestData } from "./data";
import { format } from "date-fns";
import { useId, useMemo } from "react";
import clsx from "clsx";
import { ArrowDownIcon, ArrowUpIcon } from "@1771technologies/lytenyte-pro/icons";
import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";

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

export function Header({
  column,
  grid,
  noSort,
}: HeaderCellRendererParams<RequestData> & { noSort?: boolean }) {
  const sort = grid.state.sortModel.useValue().find((c) => c.columnId === column.id);

  const isDescending = sort?.isDescending ?? false;

  return (
    <div
      className="text-ln-gray-60 flex h-full w-full items-center px-4 text-sm transition-all"
      onClick={() => {
        if (noSort) return;
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
        <>{!isDescending ? <ArrowUpIcon className="size-4" /> : <ArrowDownIcon className="size-4" />}</>
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
          (method === "PATCH" || method === "PUT" || method === "POST") && "bg-[#FF991D1C] text-[#EEA760]",
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
      <div className="text-ln-primary-50 w-full overflow-hidden text-ellipsis text-nowrap">{path}</div>
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

export function RowDetailRenderer({ row }: RowDetailRendererParams<RequestData>) {
  const data = row.data! as RequestData;

  const total =
    data["timing-phase.connection"] +
    data["timing-phase.dns"] +
    data["timing-phase.tls"] +
    data["timing-phase.transfer"] +
    data["timing-phase.ttfb"];

  const connectionPer = (data["timing-phase.connection"] / total) * 100;
  const dnsPer = (data["timing-phase.dns"] / total) * 100;
  const tlPer = (data["timing-phase.tls"] / total) * 100;
  const transferPer = (data["timing-phase.transfer"] / total) * 100;
  const ttfbPer = (data["timing-phase.ttfb"] / total) * 100;

  const ds = useClientRowDataSource({
    data: [
      {
        connectionPer,
        dnsPer,
        tlPer,
        transferPer,
        ttfbPer,
      },
    ],
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    rowHeight: "fill:24",
    columnBase: {
      // Reuse header for convenience
      headerRenderer: (p) => <Header {...(p as any)} noSort />,
      cellRenderer: (p) => {
        const field = p.grid.api.columnField(p.column, p.row) as number;

        return (
          <div className="text-ln-gray-100 flex h-full w-full items-center px-3 tabular-nums">
            {field.toFixed(2)}%
          </div>
        );
      },
    },
    columns: [
      { id: "connectionPer", name: "Connection %" },
      { id: "dnsPer", name: "DNS %" },
      { id: "tlPer", name: "TL %" },
      { id: "transferPer", name: "Transfer %" },
      { id: "ttfbPer", name: "TTFB %" },
    ],
  });
  const view = grid.view.useValue();

  return (
    <div className="h-[160px] w-full px-8 py-8">
      <div className="h-full w-full border">
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow headerRowIndex={i} key={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return <Grid.HeaderGroupCell cell={c} key={c.idOccurrence} />;

                      return <Grid.HeaderCell cell={c} key={c.column.id} className="after:bg-ln-gray-20" />;
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>

            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return <Grid.RowFullWidth row={row} key={row.id} />;

                  return (
                    <Grid.Row key={row.id} row={row} accepted={["row"]}>
                      {row.cells.map((cell) => {
                        return <Grid.Cell cell={cell} key={cell.id} />;
                      })}
                    </Grid.Row>
                  );
                })}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </div>
    </div>
  );
}
