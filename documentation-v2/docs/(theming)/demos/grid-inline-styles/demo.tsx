//#start
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useState } from "react";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";

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

//#end
export default function InlineStyles() {
  const ds = useClientDataSource({ data: bankDataSmall });

  const [cellBg, setCellBg] = useState("#0a1314");
  const [cellFg, setCellFg] = useState("#d8dfde");
  const [headerBg, setHeaderBg] = useState("#233433");
  const [headerFg, setHeaderFg] = useState("#e8eded");

  return (
    <div>
      <div className="flex flex-col gap-2 px-2 pb-4 pt-2">
        <div className="grid grid-cols-2 gap-2 2xl:grid-cols-4 2xl:gap-8">
          <label className="flex flex-col">
            <span className="pl-1 text-sm font-bold">Cell Background</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-400 px-2 py-1 dark:border-gray-200">
              <input
                type="color"
                className="h-6 w-6 border-transparent shadow-none"
                value={cellBg}
                onChange={(e) => setCellBg(e.target.value)}
              />
              <div className="text-sm">{cellBg}</div>
            </div>
          </label>
          <label className="flex flex-col">
            <span className="px-1 text-sm font-bold">Cell Text</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-400 px-2 py-1 dark:border-gray-200">
              <input
                type="color"
                className="h-6 w-6 border-transparent shadow-none"
                value={cellFg}
                onChange={(e) => setCellFg(e.target.value)}
              />
              <div className="text-sm">{cellFg}</div>
            </div>
          </label>

          <label className="flex flex-col">
            <span className="pl-1 text-sm font-bold">Header Background</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-400 px-2 py-1 dark:border-gray-200">
              <input
                type="color"
                className="h-6 w-6 border-transparent shadow-none"
                value={headerBg}
                onChange={(e) => setHeaderBg(e.target.value)}
              />
              <div className="text-sm">{headerBg}</div>
            </div>
          </label>
          <label className="flex flex-col">
            <span className="pl-1 text-sm font-bold">Header Text</span>
            <div className="flex items-center gap-2 rounded-lg border border-gray-400 px-2 py-1 dark:border-gray-200">
              <input
                type="color"
                className="h-6 w-6 border-transparent shadow-none"
                value={headerFg}
                onChange={(e) => setHeaderFg(e.target.value)}
              />
              <div className="text-sm">{headerFg}</div>
            </div>
          </label>
        </div>
      </div>
      <div style={{ height: 500 }}>
        <Grid rowSource={ds} columns={columns} columnBase={base}>
          <Grid.Viewport>
            <Grid.Header>
              {(cells) => {
                return (
                  <Grid.HeaderRow>
                    {cells.map((cell) => {
                      if (cell.kind === "group") return null;

                      return (
                        <Grid.HeaderCell
                          key={cell.id}
                          cell={cell}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            paddingInline: "8px",
                            justifyContent: cell.type === "number" ? "flex-end" : "flex-start",
                            fontSize: 14,
                            background: headerBg,
                            color: headerFg,
                            textTransform: "capitalize",
                          }}
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              }}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {(row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row}>
                      {row.cells.map((cell) => {
                        return (
                          <Grid.Cell
                            key={cell.id}
                            cell={cell}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              paddingInline: "8px",
                              justifyContent: cell.type === "number" ? "flex-end" : "flex-start",
                              fontSize: 14,
                              background: cellBg,
                              color: cellFg,
                              borderBottom: "1px solid hsla(177, 19%, 17%, 1)",
                            }}
                          />
                        );
                      })}
                    </Grid.Row>
                  );
                }}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid>
      </div>
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
//#end
