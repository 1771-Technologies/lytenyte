"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import { handleUpdate, Server } from "./server";
import type { SalaryData } from "./data";
import {
  AgeCellRenderer,
  BaseCellRenderer,
  NumberEditor,
  NumberEditorInteger,
  SalaryRenderer,
  TextEditor,
  YearsOfExperienceRenderer,
} from "./components";
import clsx from "clsx";

const columns: Column<SalaryData>[] = [
  {
    id: "Gender",
    width: 120,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
    editRenderer: TextEditor,
  },
  {
    id: "Education Level",
    name: "Education",
    width: 160,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
    editRenderer: TextEditor,
  },
  {
    id: "Age",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: AgeCellRenderer,
    editRenderer: NumberEditorInteger,
  },
  {
    id: "Years of Experience",
    name: "YoE",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: YearsOfExperienceRenderer,
    editRenderer: NumberEditorInteger,
  },
  {
    id: "Salary",
    type: "number",
    width: 160,
    widthFlex: 1,
    cellRenderer: SalaryRenderer,
    editRenderer: NumberEditor,
  },
];

export default function BasicServerData() {
  const resetKey = useId();
  const ds = useServerDataSource<SalaryData>({
    dataFetcher: (params) => {
      return Server(params.requests, resetKey);
    },
    cellUpdateHandler: async (updates) => {
      // send update to server
      await handleUpdate(updates, resetKey);
    },
    cellUpdateOptimistically: true,
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: {
      editable: true,
    },
    editCellMode: "cell",
    editClickActivator: "single",
  });

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ height: 500 }}>
      <Grid.Root grid={grid}>
        <Grid.Viewport style={{ overflowY: "scroll" }}>
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
                        className={clsx(
                          "flex h-full w-full items-center px-2 text-sm capitalize",
                          c.column.type === "number" && "justify-end",
                        )}
                      />
                    );
                  })}
                </Grid.HeaderRow>
              );
            })}
          </Grid.Header>
          <Grid.RowsContainer
            className={ds.isLoading.useValue() ? "animate-pulse bg-gray-100" : ""}
          >
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
                          className="flex h-full w-full items-center px-2 text-sm"
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
