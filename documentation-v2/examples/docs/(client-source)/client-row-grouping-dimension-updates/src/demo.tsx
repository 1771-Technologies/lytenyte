//#start
import "@1771technologies/lytenyte-pro/pill-manager.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import {
  Grid,
  PillManager,
  RowGroupCell,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro";
import { useMemo, useState } from "react";
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

//#end

export default function ClientDemo() {
  //!next 5
  const [rowGroups, setRowGroups] = useState<PillManager.T.PillItem[]>([
    { name: "Job", id: "job", active: true, movable: true },
    { name: "Education", id: "education", active: true, movable: true },
    { name: "Marital", id: "marital", active: false, movable: true },
    { name: "Contact", id: "contact", active: false, movable: true },
  ]);

  const columnsWithHide = useMemo(() => {
    return columns.map((x) => {
      if (rowGroups.find((g) => g.id === x.id && g.active)) {
        return { ...x, hide: true };
      }
      return x;
    });
  }, [rowGroups]);

  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: useMemo(() => rowGroups.filter((x) => x.active), [rowGroups]), //!
    rowGroupDefaultExpansion: true,
  });

  return (
    <>
      <div>
        {/*!next 23  */}
        <PillManager
          onPillItemActiveChange={(p) => {
            setRowGroups((prev) => {
              return [...prev].map((x) => {
                if (p.item.id === x.id) {
                  return { ...x, active: p.item.active };
                }
                return x;
              });
            });
          }}
          onPillRowChange={(ev) => {
            setRowGroups(ev.changed[0].pills);
          }}
          rows={[
            {
              id: "row-groups",
              label: "Row Groups",
              type: "row-groups",
              pills: rowGroups,
            },
          ]}
        />
      </div>
      <div className="ln-grid ln-header:data-[ln-colid=overdue]:justify-center" style={{ height: 500 }}>
        <Grid rowSource={ds} columns={columnsWithHide} columnBase={base} rowGroupColumn={group} />
      </div>
    </>
  );
}
