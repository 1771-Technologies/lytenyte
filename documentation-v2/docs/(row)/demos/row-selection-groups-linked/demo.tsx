//#start
import "@1771technologies/lytenyte-pro-experimental/components.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import type { LoanDataItem } from "@1771technologies/grid-sample-data/loan-data";
import { loanData } from "@1771technologies/grid-sample-data/loan-data";
import {
  Checkbox,
  Grid,
  RowGroupCell,
  SelectAll,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";
import {
  NumberCell,
  DurationCell,
  NameCell,
  CountryCell,
  CustomerRating,
  DateCell,
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
  { name: "Education", id: "education" },
  { name: "Job", id: "job", width: 120 },
  { name: "Overdue", id: "overdue", cellRenderer: OverdueCell },
  { name: "Duration", id: "duration", type: "number", cellRenderer: DurationCell },
  { name: "Date", id: "date", width: 110, cellRenderer: DateCell },
  { name: "Age", id: "age", width: 80, type: "number" },
  { name: "Contact", id: "contact" },
];

const base: Grid.ColumnBase<GridSpec> = { width: 100 };

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
  pin: "start",
};

const marker: Grid.ColumnMarker<GridSpec> = {
  on: true,
  cellRenderer: MarkerCell,
  headerRenderer: MarkerHeader,
};

//#end
export default function GridTheming() {
  const ds = useClientDataSource({
    data: loanData,
    group: [{ id: "job" }, { id: "education" }],
    rowGroupDefaultExpansion: true,
    rowsIsolatedSelection: false, //!
  });

  return (
    <div className="ln-grid ln-header:data-[ln-colid=overdue]:justify-center" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        columns={columns}
        columnBase={base}
        rowGroupColumn={group}
        columnMarker={marker}
        rowSelectionMode="multiple"
      />
    </div>
  );
}

//#start

function MarkerHeader(params: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SelectAll
        {...params}
        slot={({ indeterminate, selected, toggle }) => {
          return (
            <Checkbox
              checked={selected}
              indeterminate={indeterminate}
              onClick={(ev) => {
                ev.preventDefault();
                toggle();
              }}
              onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") toggle();
              }}
            />
          );
        }}
      />
    </div>
  );
}

function MarkerCell({ api, selected, indeterminate }: Grid.T.CellRendererParams<GridSpec>) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Checkbox
        checked={selected}
        indeterminate={indeterminate}
        onClick={(ev) => {
          ev.stopPropagation();
          api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target }); //!
        }}
        onKeyDown={(ev) => {
          if (ev.key === "Enter" || ev.key === " ")
            api.rowHandleSelect({ shiftKey: ev.shiftKey, target: ev.target }); //!
        }}
      />
    </div>
  );
}
//#end
