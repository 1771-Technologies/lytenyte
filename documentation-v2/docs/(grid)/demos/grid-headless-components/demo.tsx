//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource, ViewportShadows } from "@1771technologies/lytenyte-pro-experimental";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
//#end

type BankData = (typeof bankDataSmall)[number];
export interface GridSpec {
  readonly data: BankData;
}

const [under30, under50, over50] = Object.values(
  Object.groupBy(
    bankDataSmall.toSorted((l, r) => l.age - r.age),
    (r) => {
      if (r.age < 30) return "Under 30";
      if (r.age < 50) return "Under 50";
      return "Over 50";
    },
  ),
);

const finalData = [
  { id: "full-width", label: "Under 30 Years Old" } as unknown as BankData,
  ...under30,
  { id: "full-width", label: "Between 30 and 50 Years Old" } as unknown as BankData,
  ...under50,
  { id: "full-width", label: "Over 50 Years Old" } as unknown as BankData,
  ...over50,
];

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120 },
  { name: "Age", id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { name: "Balance", id: "balance", groupPath: ["Background"], type: "number", cellRenderer: BalanceCell },
  { name: "Education", id: "education", groupPath: ["Background"] },
  { name: "Marital", id: "marital" },
  { name: "Default", id: "default" },
  { name: "Housing", id: "housing" },
  { name: "Loan", id: "loan" },
  { name: "Contact", id: "contact" },
  { name: "Day", id: "day", type: "number", cellRenderer: NumberCell },
  { name: "Month", id: "month" },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
];

const base = { width: 100 };

const rowFullWidthPredicate: Grid.Props<GridSpec>["rowFullWidthPredicate"] = (r) =>
  Boolean(r.row.data && "id" in r.row.data && r.row.data.id === "full-width");
const rowFullWidthRenderer: Grid.Props<GridSpec>["rowFullWidthRenderer"] = (r) => {
  const data = r.row.data as { label: string };

  return (
    <div className="text-ln-gray-70 border-ln-gray-20 flex h-full w-full items-center justify-center border-y font-bold">
      {data.label}
    </div>
  );
};

export default function ColumnGroupExpansions() {
  const ds = useClientDataSource({
    data: finalData,
    topData: bankDataSmall.slice(0, 2),
    botData: bankDataSmall.slice(2, 4),
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        rowFullWidthPredicate={rowFullWidthPredicate}
        rowFullWidthRenderer={rowFullWidthRenderer}
        columns={columns}
        columnBase={base}
        slotShadows={ViewportShadows}
      >
        <Grid.Viewport>
          <Grid.Header />
          <Grid.RowsContainer>
            <Grid.RowsTop />
            <Grid.RowsCenter />
            <Grid.RowsBottom />
          </Grid.RowsContainer>
        </Grid.Viewport>
      </Grid>
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
//#end
