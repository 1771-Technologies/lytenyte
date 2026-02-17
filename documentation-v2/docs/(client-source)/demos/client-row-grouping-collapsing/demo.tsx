//#start
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, RowGroupCell, useClientDataSource } from "@1771technologies/lytenyte-pro";
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
  { name: "Name", id: "name", cellRenderer: NameCell, width: 110 },
  { name: "Country", id: "country", width: 150, cellRenderer: CountryCell },
  { name: "Education", id: "education" },
  { name: "Job", id: "job", width: 120 },
  { name: "Loan Amount", id: "loanAmount", width: 120, type: "number", cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: NumberCell },
  { name: "Customer Rating", id: "customerRating", type: "number", width: 125, cellRenderer: CustomerRating },
  { name: "Marital", id: "marital" },
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
          if (!row.parentId) return <div className="ps-2.5">{row.data.job}</div>;

          const parent = api.rowById(row.parentId);
          if (parent?.kind === "branch" && row.depth === 1) {
            return <div className="ps-6.5 font-bold">{row.data.marital ?? "(blank)"}</div>;
          }

          return "";
        }}
      />
    );
  },
  width: 200,
  pin: "start",
};

let seenSecondary = false;
let seenTertiary = false;
let seenBlueCollar = false;

// keep only one row when group is admin and education is not primary. Keep only one blue collar job.
const data = loanData.filter((x) => {
  if (x.job === "Blue-Collar") {
    if (seenBlueCollar) return false;
    seenBlueCollar = true;
  }

  if (x.job === "Administration" && x.education !== "Primary") {
    if (x.education === "Tertiary") {
      if (seenTertiary) return false;
      seenTertiary = true;
    }
    if (x.education === "Secondary") {
      if (seenSecondary) return false;
      seenSecondary = true;
    }
  }

  return true;
});
//#end

const groupFn: Grid.T.GroupFn<GridSpec["data"]> = (row) => {
  return [row.data.job, row.data.education];
};

export default function ClientDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: data,
    group: groupFn,
    rowGroupCollapseBehavior: "full-tree", //!
    rowGroupDefaultExpansion: 0,
  });

  return (
    <div className="ln-grid ln-header:data-[ln-colid=overdue]:justify-center" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
    </div>
  );
}
