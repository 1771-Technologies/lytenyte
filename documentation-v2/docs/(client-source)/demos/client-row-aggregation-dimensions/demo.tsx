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

const aggModel: Grid.T.DimensionAgg<GridSpec["data"]>[] = [
  { dim: { id: "name" }, fn: "onlyOneUnique" },
  { dim: { id: "country" }, fn: "onlyOneUnique" },
  { dim: { id: "loanAmount" }, fn: "avg" },
  { dim: { id: "balance" }, fn: "avg" },
  { dim: { id: "customerRating" }, fn: "avg" },
  { dim: { id: "marital" }, fn: "onlyOneUnique" },
  { dim: { id: "education" }, fn: "onlyOneUnique" },
  { dim: { id: "job" }, fn: "onlyOneUnique" },
  { dim: { id: "overdue" }, fn: "onlyOneUnique" },
  { dim: { id: "duration" }, fn: "avg" },
  { dim: { id: "date" }, fn: "onlyOneUnique" },
  { dim: { id: "age" }, fn: "avg" },
  { dim: { id: "contact" }, fn: "onlyOneUnique" },
];

const avg: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = data.map((x) => computeField<number>(field, x));
  return sum(values) / values.length;
};

const onlyOneUnique: Grid.T.Aggregator<GridSpec["data"]> = (field, data) => {
  const values = uniq(data.map((x) => computeField(field, x)));
  return values.length === 1 ? values[0] : null;
};

export default function GridTheming() {
  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: [{ id: "job" }, { id: "education" }],
    aggregate: aggModel,
    aggregateFns: {
      avg: avg,
      onlyOneUnique: onlyOneUnique,
    },
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
    </div>
  );
}
