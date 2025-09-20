"use client";

import {
  useClientRowDataSource,
  Grid,
  measureText,
} from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";

const PADDING = 20;
const columns: Column<any>[] = [
  {
    id: "age",
    type: "number",
    headerRenderer: () => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          textAlign: "center",
        }}
      >
        <div>The Age</div>
        <div>Of Bank Account owner</div>
      </div>
    ),
    width: 160,
    autosizeHeaderFn: (p) =>
      (measureText(
        "The Age Of Bank Account Owner",
        p.grid.state.viewport.get() ?? undefined
      )?.width ?? 0) + PADDING,
  },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
];

export default function ColumnAutosizingHeader() {
  const ds = useClientRowDataSource({ data: bankDataSmall });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    headerHeight: 60,
  });

  const view = grid.view.useValue();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div className="flex gap-2 py-2">
        <button
          className="bg-gray-900 text-white border border-gray-600 rounded px-2"
          onClick={() => {
            grid.api.columnAutosize({ includeHeader: true });
          }}
        >
          Autosize Columns
        </button>
        <button
          className="bg-gray-900 text-white border border-gray-600 rounded px-2"
          onClick={() => grid.state.columns.set(columns)}
        >
          Reset Columns
        </button>
      </div>
      <div className="lng-grid" style={{ height: 500 }}>
        <Grid.Root grid={grid}>
          <Grid.Viewport>
            <Grid.Header>
              {view.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return null;

                      return (
                        <Grid.HeaderCell
                          key={c.id}
                          cell={c}
                          className="flex w-full h-full capitalize px-2 items-center"
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            className="text-sm flex items-center px-2 h-full w-full"
                          />
                        );
                      })}
                    </Grid.Row>
                  );
                })}
              </Grid.RowsCenter>
            </Grid.RowsContainer>
          </Grid.Viewport>
        </Grid.Root>
      </div>
    </div>
  );
}
