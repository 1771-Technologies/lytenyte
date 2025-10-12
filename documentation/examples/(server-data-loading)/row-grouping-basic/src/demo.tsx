"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import { Server } from "./server";
import type { SalaryData } from "./data";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import {
  BaseCellRenderer,
  GroupCellRenderer,
  SalaryRenderer,
  YearsOfExperienceRenderer,
} from "./components";
import { GroupPills } from "./ui";

const columns: Column<SalaryData>[] = [
  {
    id: "Age",
    type: "number",
    width: 100,
    widthFlex: 1,
    uiHints: { rowGroupable: true },
    cellRenderer: BaseCellRenderer,
  },
  {
    id: "Gender",
    width: 120,
    widthFlex: 1,
    uiHints: { rowGroupable: true },
    cellRenderer: BaseCellRenderer,
  },
  {
    id: "Education Level",
    name: "Education",
    width: 160,
    hide: true,
    widthFlex: 1,
    uiHints: { rowGroupable: true },
    cellRenderer: BaseCellRenderer,
  },
  {
    id: "Years of Experience",
    name: "YoE",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: YearsOfExperienceRenderer,
    uiHints: {
      rowGroupable: true,
    },
  },
  { id: "Salary", type: "number", width: 160, widthFlex: 1, cellRenderer: SalaryRenderer },
];

export default function RowGroupingBasic() {
  const ds = useServerDataSource<SalaryData>({
    dataFetcher: (params) => {
      return Server(params.requests, params.model.groups);
    },
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    rowGroupColumn: {
      cellRenderer: GroupCellRenderer,
      widthFlex: 1,
    },

    rowGroupModel: ["Education Level"],
  });

  const view = grid.view.useValue();

  return (
    <>
      <GroupPills grid={grid} />
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
                          className={twMerge(
                            clsx(
                              "flex h-full w-full items-center px-2 text-sm capitalize",
                              c.column.type === "number" && "justify-end",
                            ),
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
                            className={twMerge(
                              clsx(
                                "flex h-full w-full items-center px-2 text-sm capitalize",
                                c.column.type === "number" && "justify-end tabular-nums",
                              ),
                            )}
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
    </>
  );
}
