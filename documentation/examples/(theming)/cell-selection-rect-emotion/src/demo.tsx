"use client";
import "@1771technologies/lytenyte-pro/grid.css";
import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";
import styled from "@emotion/styled";
import { BalanceCell, DurationCell, NumberCell } from "./components";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "job", width: 120 },
  { id: "age", type: "number", width: 80, cellRenderer: NumberCell },
  { id: "balance", type: "number", cellRenderer: BalanceCell },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number", cellRenderer: NumberCell },
  { id: "month" },
  { id: "duration", type: "number", cellRenderer: DurationCell },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];
export default function CellSelectionRect() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 100 },

    cellSelectionMode: "range",
    cellSelections: [{ rowStart: 4, rowEnd: 7, columnStart: 2, columnEnd: 4 }],
  });

  const view = grid.view.useValue();

  return (
    <div>
      <div style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return null;

                      return (
                        <HeaderCell
                          key={c.id}
                          cell={c}
                          style={{
                            justifyContent: c.column.type === "number" ? "flex-end" : "flex-start",
                          }}
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <RowsContainer>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Cell
                            key={c.id}
                            cell={c}
                            className="cell"
                            style={{
                              justifyContent:
                                c.column.type === "number" ? "flex-end" : "flex-start",
                            }}
                          />
                        );
                      })}
                    </Row>
                  );
                })}
              </Grid.RowsCenter>
            </RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </div>
    </div>
  );
}

const Cell = styled(Grid.Cell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(white, hsla(190, 32%, 6%, 1));
  color: light-dark(hsla(175, 6%, 38%, 1), hsla(175, 10%, 86%, 1));
  font-size: 14px;
  border-bottom: 1px solid light-dark(hsla(175, 20%, 95%, 1), hsla(177, 19%, 17%, 1));
`;

const HeaderCell = styled(Grid.HeaderCell)`
  display: flex;
  align-items: center;
  padding-inline: 8px;
  background-color: light-dark(hsla(175, 12%, 92%, 1), hsla(177, 19%, 17%, 1));
  color: light-dark(hsla(177, 19%, 17%, 1), hsla(175, 12%, 92%, 1));
  text-transform: capitalize;
  font-size: 14px;
`;

const Row = styled(Grid.Row)`
  &[data-ln-alternate="true"] .cell {
    background-color: light-dark(hsl(0, 27%, 98%), hsl(184, 33%, 8%));
  }
`;

const RowsContainer = styled(Grid.RowsContainer)`
  & [data-ln-cell-selection-rect]:not([data-ln-cell-selection-is-unit="true"]) {
    background-color: var(--lng1771-primary-30);
    box-sizing: border-box;

    &[data-ln-cell-selection-border-top="true"] {
      border-top: 1px solid var(--lng1771-primary-50);
    }
    &[data-ln-cell-selection-border-bottom="true"] {
      border-bottom: 1px solid var(--lng1771-primary-50);
    }
    &[data-ln-cell-selection-border-start="true"] {
      border-inline-start: 1px solid var(--lng1771-primary-50);
    }
    &[data-ln-cell-selection-border-end="true"] {
      border-inline-end: 1px solid var(--lng1771-primary-50);
    }
  }
  & [data-ln-cell-selection-rect][data-ln-cell-selection-is-unit="true"] {
    outline: 1px solid var(--lng1771-primary-50);
    outline-offset: -1px;
  }
`;
