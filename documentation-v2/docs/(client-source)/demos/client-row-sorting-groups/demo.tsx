//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import {
  Grid,
  RowGroupCell,
  useClientDataSource,
  usePiece,
  type PieceWritable,
} from "@1771technologies/lytenyte-pro-experimental";
import { useMemo, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

export type BankData = (typeof bankDataSmall)[number];
interface GridSpec {
  readonly data: BankData;
  readonly api: { sort: PieceWritable<{ id: string; dir: "asc" | "desc" | null } | null> };
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120 },
  { name: "Age", id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: BalanceCell },
  { name: "Education", id: "education" },
  { name: "Marital", id: "marital" },
  { name: "Default", id: "default" },
  { name: "Housing", id: "housing" },
  { name: "Loan", id: "loan" },
  { name: "Contact", id: "contact" },
  { name: "Day", id: "day", type: "number", cellRenderer: NumberCell },
  { name: "Month", id: "month" },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
];

const base: Grid.ColumnBase<GridSpec> = { width: 100, headerRenderer: Header };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

//#end
export default function GridTheming() {
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" | null } | null>({
    id: "__ln_group__",
    dir: "desc",
  });

  const ds = useClientDataSource<GridSpec>({
    data: bankDataSmall,
    group: [{ id: "job" }, { id: "education" }],
    sort: useMemo(() => {
      if (!sort) return null;

      return [{ dim: { id: sort.id }, descending: sort.dir === "desc" }];
    }, [sort]),
    rowGroupDefaultExpansion: true,
  });

  const sort$ = usePiece(sort, setSort);
  const apiExtension = useMemo(() => {
    return {
      sort: sort$,
    } satisfies GridSpec["api"];
  }, [sort$]);

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        apiExtension={apiExtension}
        rowSource={ds}
        columns={columns}
        columnBase={base}
        rowGroupColumn={group}
        events={useMemo<Grid.Events<GridSpec>>(
          () => ({
            headerCell: {
              keyDown: (column, ev) => {
                if (ev.key === "Enter") {
                  setSort((sort) => {
                    const columnSort = sort?.id === column.id ? (sort.dir ?? "desc") : null;
                    const nextSort = columnSort === "asc" ? null : columnSort === "desc" ? "asc" : "desc";
                    return nextSort == null ? null : { id: column.id, dir: nextSort };
                  });
                }
              },
              click: (column) => {
                setSort((sort) => {
                  const columnSort = sort?.id === column.id ? (sort.dir ?? "desc") : null;
                  const nextSort = columnSort === "asc" ? null : columnSort === "desc" ? "asc" : "desc";
                  return nextSort == null ? null : { id: column.id, dir: nextSort };
                });
              },
            },
          }),
          [],
        )}
      />
    </div>
  );
}

//#start

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function BalanceCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}
export function DurationCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? `${formatter.format(field)} days` : `${field ?? "-"}`;
}

export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}

function Header({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  const sort = api.sort.useValue();
  const columnSort = sort?.id === column.id ? (sort.dir ?? "desc") : null;

  return (
    <div
      className="relative flex h-full w-full cursor-pointer items-center text-sm transition-colors"
      style={{
        justifyContent: column.type === "number" ? "flex-end" : undefined,
      }}
    >
      {column.type === "number" && (
        <>
          {columnSort === "asc" && <ArrowUpIcon className="text-ln-text-dark size-4" />}
          {columnSort === "desc" && <ArrowDownIcon className="text-ln-text-dark size-4" />}
        </>
      )}
      <div>{column.name ?? column.id}</div>
      {column.type !== "number" && (
        <>
          {columnSort === "asc" && <ArrowUpIcon className="text-ln-text-dark size-4" />}
          {columnSort === "desc" && <ArrowDownIcon className="text-ln-text-dark size-4" />}
        </>
      )}
    </div>
  );
}
