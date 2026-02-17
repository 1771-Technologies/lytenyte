//#start
import { cva } from "class-variance-authority";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

//!next 3
export function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

//!next 13
const cellStyles = cva("flex items-center px-2", {
  variants: {
    number: {
      true: "justify-end tabular-nums",
    },
    rowBase: {
      true: "border-b border-neutral-200 bg-white text-sm text-neutral-800 group-data-[ln-alternate=true]:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:group-data-[ln-alternate=true]:bg-neutral-950",
    },
    header: {
      true: "border-b border-neutral-100 bg-neutral-200 text-sm capitalize text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
    },
  },
});

export default function ThemingDemo() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div className="classes">
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
                          className={tw(cellStyles({ number: cell.type === "number", header: true }))} //!
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
                    <Grid.Row row={row} className="group">
                      {row.cells.map((cell) => {
                        return (
                          <Grid.Cell
                            key={cell.id}
                            cell={cell}
                            //!next 6
                            className={tw(
                              cellStyles({
                                number: cell.type === "number",
                                rowBase: true,
                              }),
                            )}
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
