//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { sum, uniq } from "es-toolkit";
import { Grid, RowGroupCell, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { loanData, type LoanDataItem } from "@1771technologies/grid-sample-data/loan-data";
import {
  AgeCell,
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
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Name", id: "name", cellRenderer: NameCell, width: 110 },
  { name: "Country", id: "country", width: 150, cellRenderer: CountryCell },
  { name: "Loan Amount", id: "loanAmount", width: 120, type: "number", cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: NumberCell },
  { name: "Customer Rating", id: "customerRating", type: "number", width: 125, cellRenderer: CustomerRating },
  { name: "Marital", id: "marital" },
  { name: "Education", id: "education", hide: true },
  { name: "Job", id: "job", width: 120, hide: true },
  { name: "Overdue", id: "overdue", cellRenderer: OverdueCell },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
  { name: "Date", id: "date", width: 110, cellRenderer: DateCell },
  { name: "Age", id: "age", width: 80, type: "number", cellRenderer: AgeCell },
  { name: "Contact", id: "contact" },
];

const base: Grid.ColumnBase<GridSpec> = { width: 100 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
};

//#end

const aggFn: Grid.T.AggregationFn<GridSpec["data"]> = (data) => {
  const name = uniq(data.map((x) => x.data.name)).length === 1 ? data[0].data.name : null;
  const country = uniq(data.map((x) => x.data.country)).length === 1 ? data[0].data.country : null;
  const loanAmount = sum(data.map((x) => x.data.loanAmount)) / data.length;
  const balance = sum(data.map((x) => x.data.balance)) / data.length;
  const customerRating = sum(data.map((x) => x.data.customerRating)) / data.length;
  const marital = uniq(data.map((x) => x.data.marital)).length === 1 ? data[0].data.marital : null;
  const education = uniq(data.map((x) => x.data.education)).length === 1 ? data[0].data.education : null;
  const job = uniq(data.map((x) => x.data.job)).length === 1 ? data[0].data.job : null;
  const overdue = uniq(data.map((x) => x.data.overdue)).length === 1 ? data[0].data.overdue : null;
  const duration = sum(data.map((x) => x.data.duration)) / data.length;
  const date = uniq(data.map((x) => x.data.date)).length === 1 ? data[0].data.date : null;
  const age = sum(data.map((x) => x.data.age)) / data.length;
  const contact = uniq(data.map((x) => x.data.contact)).length === 1 ? data[0].data.contact : null;

  return {
    name,
    country,
    loanAmount,
    balance,
    customerRating,
    marital,
    education,
    job,
    overdue,
    duration,
    date,
    age,
    contact,
  };
};

export default function GridTheming() {
  const ds = useClientDataSource<GridSpec>({
    data: loanData,
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

//#start
