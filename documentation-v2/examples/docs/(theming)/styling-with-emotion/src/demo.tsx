//#start
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import styled from "@emotion/styled";
import { useMemo } from "react";

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

//!next 33
const Cell = styled(Grid.Cell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(white, hsla(190, 32%, 6%, 1));
  color: light-dark(hsla(175, 6%, 38%, 1), hsla(175, 10%, 86%, 1));
  font-size: 14px;
  border-bottom: 1px solid light-dark(hsla(175, 20%, 95%, 1), hsla(177, 19%, 17%, 1));

  &[data-ln-type="number"] {
    justify-content: flex-end;
  }
`;

const HeaderCell = styled(Grid.HeaderCell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(hsla(175, 12%, 92%, 1), hsla(177, 19%, 17%, 1));
  color: light-dark(hsla(177, 19%, 17%, 1), hsla(175, 12%, 92%, 1));
  text-transform: capitalize;
  font-size: 14px;

  &[data-ln-type="number"] {
    justify-content: flex-end;
  }
`;

const Row = styled(Grid.Row)`
  &[data-ln-alternate="true"] [data-ln-cell="true"] {
    background-color: light-dark(hsl(0, 27%, 98%), hsl(184, 33%, 8%));
  }
`;

export default function ThemingDemo() {
  const ds = useClientDataSource({ data: bankDataSmall });

  const cache = useMemo(() => {
    return createCache({ key: "x" });
  }, []);

  return (
    <CacheProvider value={cache}>
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

                        return <HeaderCell key={cell.id} cell={cell} />; //!
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
                      //!next
                      <Row row={row}>
                        {row.cells.map((cell) => {
                          return <Cell cell={cell} key={cell.id} />; //!
                        })}
                      </Row>
                    );
                  }}
                </Grid.RowsCenter>
              </Grid.RowsContainer>
            </Grid.Viewport>
          </Grid>
        </div>
      </div>
    </CacheProvider>
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
