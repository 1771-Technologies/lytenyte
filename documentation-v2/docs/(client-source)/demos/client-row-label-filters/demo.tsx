//#start
import "@1771technologies/lytenyte-pro/pill-manager.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
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
import { PillManager, RowGroupCell } from "@1771technologies/lytenyte-pro/components";

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

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
  pin: "start",
};

//#end

export default function ClientDemo() {
  const [pills, setPills] = useState<PillManager.T.PillRow[]>(() => {
    const allEducation = [...new Set(loanData.map((x) => x.education))]
      .sort()
      .map<PillManager.T.PillItem>((x) => ({ active: true, id: x, name: x }));
    const allJobs = [...new Set(loanData.map((x) => x.job))]
      .sort()
      .map<PillManager.T.PillItem>((x) => ({ active: true, id: x, name: x }));

    return [
      { id: "job", pills: allJobs, type: "columns", label: "Job" },
      { id: "education", pills: allEducation, type: "columns", label: "Education" },
    ] satisfies PillManager.T.PillRow[];
  });

  const labelFilter = useMemo(() => {
    const filters: (Grid.T.LabelFilter | null)[] = [];

    for (const pillRow of pills) {
      const inactive = new Set(pillRow.pills.filter((x) => !x.active).map((x) => x.id));
      if (inactive.size === 0) {
        filters.push(null);
        continue;
      } else {
        filters.push((s) => !inactive.has(s as string));
      }
    }

    return filters;
  }, [pills]);

  const ds = useClientDataSource<GridSpec>({
    data: loanData,
    group: [{ id: "job" }, { id: "education" }],
    sort: [{ dim: { id: "__ln_group__" }, descending: false }],
    labelFilter,
    rowGroupDefaultExpansion: true,
  });

  return (
    <>
      <div>
        <PillManager
          onPillItemActiveChange={(p) => {
            setPills((prev) => {
              const next = [...prev];
              const newRow = { ...next[p.index] };

              newRow.pills = newRow.pills.map((x) => {
                if (p.item.id === x.id) {
                  return { ...x, active: p.item.active };
                }
                return x;
              });

              next[p.index] = newRow;

              return next;
            });
          }}
          rows={pills}
        />
      </div>
      <div className="ln-grid ln-header:data-[ln-colid=overdue]:justify-center" style={{ height: 500 }}>
        <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
      </div>
    </>
  );
}
