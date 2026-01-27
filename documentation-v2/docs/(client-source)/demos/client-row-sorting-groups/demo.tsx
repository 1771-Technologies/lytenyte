//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  Grid,
  RowGroupCell,
  useClientDataSource,
  usePiece,
  type PieceWritable,
} from "@1771technologies/lytenyte-pro-experimental";
import { useMemo, useState } from "react";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { loanData, type LoanDataItem } from "@1771technologies/grid-sample-data/loan-data";
import {
  CountryCell,
  CustomerRating,
  DateCell,
  DurationCell,
  NameCell,
  NumberCell,
  OverdueCell,
} from "./components.js";

export interface GridSpec {
  readonly data: LoanDataItem;
  readonly api: { sort: PieceWritable<{ id: string; dir: "asc" | "desc" | null } | null> };
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Name", id: "name", cellRenderer: NameCell, width: 110 },
  { name: "Country", id: "country", width: 150, cellRenderer: CountryCell },
  { name: "Loan Amount", id: "loanAmount", width: 140, type: "number", cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: NumberCell },
  { name: "Customer Rating", id: "customerRating", type: "number", width: 150, cellRenderer: CustomerRating },
  { name: "Marital", id: "marital" },
  { name: "Education", id: "education", width: 120 },
  { name: "Job", id: "job", width: 120 },
  { name: "Overdue", id: "overdue", cellRenderer: OverdueCell },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
  { name: "Date", id: "date", width: 110, cellRenderer: DateCell },
  { name: "Age", id: "age", width: 80, type: "number" },
  { name: "Contact", id: "contact" },
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
  const [expansions, setExpansions] = useState<Record<string, boolean | undefined>>({
    Technician: true,
    "Technician->Tertiary": true,
  });

  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: [{ id: "job" }, { id: "education" }],
    sort: useMemo(() => {
      if (!sort) return null;

      return [{ dim: { id: sort.id }, descending: sort.dir === "desc" }];
    }, [sort]),
    rowGroupExpansions: expansions,
    onRowGroupExpansionChange: setExpansions,
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
              keyDown: ({ event: ev, column }) => {
                if (ev.key === "Enter") {
                  setSort((sort) => {
                    const columnSort = sort?.id === column.id ? (sort.dir ?? "desc") : null;
                    const nextSort = columnSort === "asc" ? null : columnSort === "desc" ? "asc" : "desc";
                    return nextSort == null ? null : { id: column.id, dir: nextSort };
                  });
                }
              },
              click: ({ column }) => {
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

//#end
