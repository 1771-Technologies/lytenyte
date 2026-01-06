//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { sum, uniq } from "es-toolkit";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import {
  computeField,
  Grid,
  RowGroupCell,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";

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

//#end

const aggModel: Grid.T.DimensionAgg<GridSpec["data"]>[] = [
  { dim: { id: "job" }, fn: "onlyOneUnique" },
  { dim: { id: "age" }, fn: "avg" },
  { dim: { id: "balance" }, fn: "avg" },
  { dim: { id: "education" }, fn: "onlyOneUnique" },
  { dim: { id: "marital" }, fn: "onlyOneUnique" },
  { dim: { id: "housing" }, fn: "onlyOneUnique" },
  { dim: { id: "default" }, fn: "onlyOneUnique" },
  { dim: { id: "loan" }, fn: "onlyOneUnique" },
  { dim: { id: "contact" }, fn: "onlyOneUnique" },
  { dim: { id: "day" }, fn: "avg" },
  { dim: { id: "month" }, fn: "onlyOneUnique" },
  { dim: { id: "duration" }, fn: "avg" },
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
    data: bankDataSmall,
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
