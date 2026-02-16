//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { sum } from "es-toolkit";
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
  TextCell,
} from "./components.js";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export interface GridSpec {
  readonly data: LoanDataItem;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Name", id: "name", cellRenderer: NameCell, width: 110 },
  { name: "Country", id: "country", width: 150, cellRenderer: CountryCell },
  { name: "Loan Amount", id: "loanAmount", width: 145, type: "number", cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: NumberCell, width: 120 },
  { name: "Customer Rating", id: "customerRating", type: "number", width: 170, cellRenderer: CustomerRating },
  { name: "Marital", id: "marital", width: 130 },
  { name: "Education", id: "education", hide: true },
  { name: "Job", id: "job", width: 140, hide: true },
  { name: "Overdue", id: "overdue", width: 120, cellRenderer: OverdueCell },
  { name: "Duration", id: "duration", type: "number", width: 120, cellRenderer: DurationCell },
  { name: "Date", id: "date", width: 140, cellRenderer: DateCell },
  { name: "Age", id: "age", width: 120, type: "number", cellRenderer: AgeCell },
  { name: "Contact", id: "contact", width: 130 },
];

const base: Grid.ColumnBase<GridSpec> = { width: 100, headerRenderer: HeaderCell, cellRenderer: TextCell };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  headerRenderer: () => <div className="flex items-center">Group</div>,
  width: 200,
  pin: "start",
};

//#end

const aggFn: Grid.T.AggregationFn<GridSpec["data"]> = (data) => {
  const name = data.length;
  const country = data.length;
  const loanAmount = Math.round(sum(data.map((x) => x.data.loanAmount)) / data.length);
  const balance = Math.round(sum(data.map((x) => x.data.balance)) / data.length);
  const customerRating = Math.round(sum(data.map((x) => x.data.customerRating)) / data.length);
  const marital = data.length;
  const education = data.length;
  const job = data.length;
  const overdue = data.length;
  const duration = Math.round(sum(data.map((x) => x.data.duration)) / data.length);
  const date = data.length;
  const age = Math.round(sum(data.map((x) => x.data.age)) / data.length);
  const contact = data.length;

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

export default function ClientDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: [{ id: "job" }, { id: "education" }],
    aggregate: aggFn,
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid ln-header:data-[ln-colid=overdue]:justify-center" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
    </div>
  );
}

//#start

export function HeaderCell({ column }: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div
      className={tw(
        "flex items-center justify-between gap-1",
        column.type === "number" && "flex-row-reverse",
      )}
    >
      <div>{column.name ?? column.id}</div>
      <div className="text-ln-primary-50 text-[10px]">({column.type === "number" ? "avg" : "count"})</div>
    </div>
  );
}
function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
