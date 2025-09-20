"use client";

import { useClientRowDataSource, Grid } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];
const columns: Column<BankData>[] = [
  { id: "age", width: 100, type: "number" },
  { id: "job", width: 160 },
  { id: "balance", width: 160, type: "number" },
  { id: "education", width: 160 },
  {
    id: "marital",
    editable: true,
    editRenderer: (p) => {
      return (
        <select
          style={{ width: "100%", height: "100%", boxSizing: "border-box" }}
          value={p.value as string}
          onChange={(e) => p.onChange(e.target.value)}
        >
          <option>married</option>
          <option>divorced</option>
          <option>single</option>
        </select>
      );
    },
  },
];

export default function CellEditingProvider() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnBase: {
      widthFlex: 1,
      editable: true,

      editRenderer: ({ column, onChange, value }) => {
        const type =
          column.type === "datetime" || column.type === "date"
            ? "date"
            : column.type === "number"
            ? "number"
            : undefined;

        return (
          <input
            className="w-full h-full text-sm bg-black text-white px-2"
            type={type}
            value={`${value}`}
            onChange={(ev) => {
              if (type === "number")
                onChange(Number.parseFloat(ev.target.value));
              else onChange(ev.target.value);
            }}
          />
        );
      },
    },

    editCellMode: "cell",
    editClickActivator: "single",
  });

  const view = grid.view.useValue();

  return (
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
  );
}
