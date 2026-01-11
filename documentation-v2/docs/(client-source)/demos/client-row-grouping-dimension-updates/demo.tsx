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
    data: bankDataSmall,
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
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid rowSource={ds} columns={columnsWithHide} columnBase={base} rowGroupColumn={group} />
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
