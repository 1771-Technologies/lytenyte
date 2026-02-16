//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { sum, uniq } from "es-toolkit";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, RowGroupCell, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";

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

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

const aggFn: Grid.T.AggregationFn<GridSpec["data"]> = (data) => {
  const job = uniq(data.map((x) => x.data.job)).length === 1 ? data[0].data.job : null;
  const age = sum(data.map((x) => x.data.age)) / data.length;
  const balance = sum(data.map((x) => x.data.balance)) / data.length;
  const education = uniq(data.map((x) => x.data.education)).length === 1 ? data[0].data.education : null;
  const marital = uniq(data.map((x) => x.data.marital)).length === 1 ? data[0].data.marital : null;
  const housing = uniq(data.map((x) => x.data.housing)).length === 1 ? data[0].data.housing : null;
  const default_ = uniq(data.map((x) => x.data.default)).length === 1 ? data[0].data.default : null;
  const loan = uniq(data.map((x) => x.data.loan)).length === 1 ? data[0].data.loan : null;
  const contact = uniq(data.map((x) => x.data.contact)).length === 1 ? data[0].data.contact : null;
  const day = sum(data.map((x) => x.data.day)) / data.length;
  const month = uniq(data.map((x) => x.data.month)).length === 1 ? data[0].data.month : null;
  const duration = sum(data.map((x) => x.data.duration)) / data.length;

  return {
    job,
    age,
    housing,
    balance,
    education,
    marital,
    default: default_,
    loan,
    contact,
    day,
    month,
    duration,
  };
};

export default function CellDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: bankDataSmall,
    group: [{ id: "job" }, { id: "education" }],
    aggregate: aggFn,
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
    </div>
  );
}
//#end

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function BalanceCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row); //!

  if (typeof field === "number") {
    if (field < 0) return `-$${formatter.format(Math.abs(field))}`;

    return "$" + formatter.format(field);
  }

  return `${field ?? "-"}`;
}

//#start
export function DurationCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? `${formatter.format(field)} days` : `${field ?? "-"}`;
}

export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  return typeof field === "number" ? formatter.format(field) : `${field ?? "-"}`;
}
//#end
