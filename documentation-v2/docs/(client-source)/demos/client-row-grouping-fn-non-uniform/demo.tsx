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
import { useState } from "react";

export interface GridSpec {
  readonly data: LoanDataItem;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Name", id: "name", cellRenderer: NameCell, width: 110 },
  { name: "Country", id: "country", width: 150, cellRenderer: CountryCell },
  { name: "Job", id: "job", width: 120 },
  { name: "Education", id: "education" },
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
          if (!row.parentId) return row.data.education;

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
};

//#end

//!next 3
const groupFn: Grid.T.GroupFn<GridSpec["data"]> = (row) => {
  if (row.data.education === "Secondary") return null;

  if (row.data.marital === "Single") return [row.data.job];

  return [row.data.job, row.data.education];
};

export default function RowGrouping() {
  const [expansions, setExpansions] = useState<Record<string, boolean | undefined>>({
    Services: true,
  });

  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: groupFn, //!
    rowGroupExpansions: expansions,
    onRowGroupExpansionChange: setExpansions,
  });

  return (
    <div className="ln-grid ln-header:data-[ln-colid=overdue]:justify-center" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
    </div>
  );
}
