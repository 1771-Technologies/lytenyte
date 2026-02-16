//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { sum, uniq } from "es-toolkit";
import {
  computeField,
  Grid,
  RowGroupCell,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";
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

const aggModel: Grid.T.DimensionAgg<GridSpec["data"]>[] = [
  { dim: { id: "name" }, fn: "count" },
  { dim: { id: "country" }, fn: "same" },
  { dim: { id: "loanAmount" }, fn: "avg" },
  { dim: { id: "balance" }, fn: "avg" },
  { dim: { id: "customerRating" }, fn: "avg" },
  { dim: { id: "marital" }, fn: "count" },
  { dim: { id: "education" }, fn: "same" },
  { dim: { id: "job" }, fn: "same" },
  { dim: { id: "overdue" }, fn: "same" },
  { dim: { id: "duration" }, fn: "avg" },
  { dim: { id: "date" }, fn: "count" },
  { dim: { id: "age" }, fn: "avg" },
  { dim: { id: "contact" }, fn: "count" },
];

const countCols = ["name", "marital", "date", "contact"];

const avg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return Math.round(sum(values) / values.length);
};

const same: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = uniq(data.map((x) => computeField(field, x)));
  return values.length === 1 ? values[0] : null;
};
const count: Grid.T.Aggregator<GridSpec["data"]> = (_, data) => {
  return data.length;
};

export default function ClientDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: [{ id: "job" }, { id: "education" }],
    aggregate: aggModel,
    aggregateFns: {
      avg: avg,
      same: same,
      count: count,
    },
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid ln-header:data-[ln-colid=overdue]:justify-center" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
    </div>
  );
}

export function HeaderCell({ column }: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div
      className={tw(
        "flex items-center justify-between gap-1",
        column.type === "number" && "flex-row-reverse",
      )}
    >
      <div>{column.name ?? column.id}</div>
      <div className="text-ln-primary-50 text-[10px]">
        ({countCols.includes(column.id) ? "count" : column.type === "number" ? "avg" : "same"})
      </div>
    </div>
  );
}
function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}
