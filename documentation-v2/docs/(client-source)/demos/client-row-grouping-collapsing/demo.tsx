//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, RowGroupCell, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
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
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120, hide: true },
  { name: "Name", id: "name", cellRenderer: NameCell, width: 110 },
  { name: "Country", id: "country", width: 150, cellRenderer: CountryCell },
  { name: "Loan Amount", id: "loanAmount", width: 120, type: "number", cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: NumberCell },
  { name: "Customer Rating", id: "customerRating", type: "number", width: 125, cellRenderer: CustomerRating },
  { name: "Marital", id: "marital" },
  { name: "Education", id: "education", hide: true },
  { name: "Overdue", id: "overdue", cellRenderer: OverdueCell },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
  { name: "Date", id: "date", width: 110, cellRenderer: DateCell },
  { name: "Age", id: "age", width: 80, type: "number" },
  { name: "Contact", id: "contact" },
];

const base: Grid.ColumnBase<GridSpec> = { width: 100 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: (props) => {
    return (
      <RowGroupCell
        {...props}
        leafLabel={(row, api) => {
          if (!row.parentId) return row.data.education;

          const parent = api.rowById(row.parentId);
          if (parent?.kind === "branch" && row.depth === 1) {
            return parent.key ?? "(blank)";
          }

          return "";
        }}
      />
    );
  },
  width: 200,
};

let seen = false;

// Keep only one row with education primary and unemployed
const data = loanData.filter((x) => {
  if (x.job === "Unemployed") {
    if (seen) return false;

    seen = true;
    return true;
  }

  return true;
});

//#end

const groupFn: Grid.T.GroupFn<GridSpec["data"]> = (row) => {
  return [row.data.job, row.data.education];
};

export default function ClientSourceDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: data,
    group: groupFn,
    rowGroupCollapseBehavior: "full-tree", //!
    rowGroupDefaultExpansion: true,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
    </div>
  );
}
