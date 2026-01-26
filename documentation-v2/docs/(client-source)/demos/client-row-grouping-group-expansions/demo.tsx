//#start
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";
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
  { name: "Loan Amount", id: "loanAmount", width: 120, type: "number", cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: NumberCell },
  { name: "Customer Rating", id: "customerRating", type: "number", width: 125, cellRenderer: CustomerRating },
  { name: "Marital", id: "marital" },
  { name: "Education", id: "education", hide: true },
  { name: "Job", id: "job", width: 120, hide: true },
  { name: "Overdue", id: "overdue", cellRenderer: OverdueCell },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
  { name: "Date", id: "date", width: 110, cellRenderer: DateCell },
  { name: "Age", id: "age", width: 80, type: "number" },
  { name: "Contact", id: "contact" },
];

const base: Grid.ColumnBase<GridSpec> = { width: 100 };

//#end

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: ({ row, api }) => {
    if (!api.rowIsGroup(row)) return "";

    return (
      <div className="flex h-full w-full items-center gap-2" style={{ paddingInlineStart: 16 * row.depth }}>
        <button
          className="size-5 cursor-pointer"
          style={{ transform: row.expanded ? "rotate(90deg)" : undefined }}
          onClick={() => api.rowGroupToggle(row)} //!
        >
          <ChevronRightIcon />
        </button>

        <div>{row.key}</div>
      </div>
    );
  },
  width: 200,
};

const groupFn: Grid.T.GroupFn<GridSpec["data"]> = (row) => {
  return [row.data.job, row.data.education];
};

export default function GridTheming() {
  const [expansions, setExpansions] = useState<Record<string, boolean | undefined>>({}); //!
  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: groupFn,
    rowGroupExpansions: expansions,
    onRowGroupExpansionChange: setExpansions,
  });

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
    </div>
  );
}
