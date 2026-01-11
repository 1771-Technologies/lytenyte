//#start
import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import {
  Grid,
  PillManager,
  RowGroupCell,
  useClientDataSource,
} from "@1771technologies/lytenyte-pro-experimental";
import { useMemo, useState } from "react";

export type BankData = (typeof bankDataSmall)[number];
interface GridSpec {
  readonly data: BankData;
}

const columns: Grid.Column<GridSpec>[] = [
  { name: "Job", id: "job", width: 120 },
  { name: "Age", id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { name: "Balance", id: "balance", type: "number", cellRenderer: BalanceCell },
  { name: "Education", id: "education" },
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

export default function RowGrouping() {
  const [pills, setPills] = useState<PillManager.T.PillRow[]>(() => {
    const allEducation = [...new Set(bankDataSmall.map((x) => x.education))]
      .sort()
      .map<PillManager.T.PillItem>((x) => ({ active: true, id: x, name: x }));
    const allJobs = [...new Set(bankDataSmall.map((x) => x.job))]
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
    data: bankDataSmall,
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
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowSource={ds} columns={columns} columnBase={base} rowGroupColumn={group} />
      </div>
    </>
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
