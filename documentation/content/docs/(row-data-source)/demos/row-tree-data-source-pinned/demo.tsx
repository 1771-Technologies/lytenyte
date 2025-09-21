"use client";

import { Grid, useClientTreeDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { fileData } from "@1771technologies/sample-data/file-data";
import { useId } from "react";

type FileData = (typeof fileData)[number];

const columns: Column<FileData>[] = [
  {
    id: "path",
    cellRenderer: ({ grid, row }) => {
      if (!row.data) return null;

      if (grid.api.rowIsLeaf(row)) {
        const field = row.data.path;

        return <div className="flex items-center px-2">{field}</div>;
      }
      const field = row.key;
      const isExpanded = grid.api.rowGroupIsExpanded(row);

      return (
        <div
          className="flex h-full w-full items-center gap-2"
          style={{ paddingLeft: row.depth * 16 }}
        >
          <button
            className="flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              grid.api.rowGroupToggle(row);
            }}
          >
            {!isExpanded && <ChevronRightIcon />}
            {isExpanded && <ChevronDownIcon />}
          </button>

          <div>{`${field}`}</div>
        </div>
      );
    },
  },
  { id: "size" },
  { id: "lastModified" },
  { id: "type" },
  { id: "owner" },
  { id: "permissions" },
  { id: "isHidden" },
];

export default function RowTreeDataSourceWithPinned() {
  const ds = useClientTreeDataSource<FileData>({
    data: fileData,
    getPathFromData: ({ data }) => (data ? data.path.split("/").filter((c) => !!c) : []),
    topData: fileData.slice(0, 2),
    bottomData: fileData.slice(2, 4),
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
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
                        className="flex h-full w-full items-center px-2 capitalize"
                      />
                    );
                  })}
                </Grid.HeaderRow>
              );
            })}
          </Grid.Header>
          <Grid.RowsContainer>
            <Grid.RowsTop>
              {view.rows.top.map((row) => {
                if (row.kind === "full-width") return null;

                return (
                  <Grid.Row row={row} key={row.id}>
                    {row.cells.map((c) => {
                      return (
                        <Grid.Cell
                          key={c.id}
                          cell={c}
                          className="flex h-full w-full items-center overflow-hidden text-nowrap px-2 text-sm"
                        />
                      );
                    })}
                  </Grid.Row>
                );
              })}
            </Grid.RowsTop>

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
                          className="flex h-full w-full items-center overflow-hidden text-nowrap px-2 text-sm"
                        />
                      );
                    })}
                  </Grid.Row>
                );
              })}
            </Grid.RowsCenter>

            <Grid.RowsBottom>
              {view.rows.bottom.map((row) => {
                if (row.kind === "full-width") return null;

                return (
                  <Grid.Row row={row} key={row.id}>
                    {row.cells.map((c) => {
                      return (
                        <Grid.Cell
                          key={c.id}
                          cell={c}
                          className="flex h-full w-full items-center overflow-hidden text-nowrap px-2 text-sm"
                        />
                      );
                    })}
                  </Grid.Row>
                );
              })}
            </Grid.RowsBottom>
          </Grid.RowsContainer>
        </Grid.Viewport>
      </Grid.Root>
    </div>
  );
}
