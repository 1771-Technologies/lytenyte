//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { ChevronRightIcon, MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";

export type BankData = (typeof bankDataSmall)[number];
interface GridSpec {
  readonly data: BankData;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120, hide: true },
  { name: "Age", id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: BalanceCell },
  { name: "Education", id: "education", hide: true },
  { name: "Marital", id: "marital" },
  { name: "Default", id: "default" },
  { name: "Housing", id: "housing" },
  { name: "Loan", id: "loan" },
  { name: "Contact", id: "contact" },
  { name: "Day", id: "day", type: "number", cellRenderer: NumberCell },
  { name: "Month", id: "month" },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
];

const base: Grid.ColumnBase<GridSpec> = { width: 100 };

//#end

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: ({ row, api }) => {
    if (!api.rowIsGroup(row)) return "";

    return (
      <div className="flex h-full w-full items-center gap-2" style={{ paddingInlineStart: 16 * row.depth }}>
        <button
          className="size-5 cursor-pointer"
          //!next 5
          onClick={() => {
            const siblings = api.rowSiblings(row.id);
            const update = Object.fromEntries(siblings.map((x) => [x, !row.expanded]));
            api.rowGroupExpansionChange(update);
          }}
        >
          {row.expanded && <MinusCircledIcon />}
          {!row.expanded && <PlusCircledIcon />}
        </button>
        <button
          className="size-5 cursor-pointer"
          style={{ transform: row.expanded ? "rotate(90deg)" : undefined }}
          onClick={() => api.rowGroupToggle(row)} //!
        >
          <ChevronRightIcon />
        </button>

        <div>{row.key}</div>
      </div>
    );
  },
  width: 200,
};

const groupFn: Grid.T.GroupFn<GridSpec["data"]> = (row) => {
  return [row.data.job, row.data.education];
};

export default function GridTheming() {
  const ds = useClientDataSource<GridSpec>({
    data: bankDataSmall,
    group: groupFn,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
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
