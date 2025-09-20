"use client";

import { Grid, useClientTreeDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import {
  ChevronDownIcon,
  ChevronRightIcon,
} from "@1771technologies/lytenyte-pro/icons";
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
          className="flex items-center gap-2 w-full h-full"
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

export default function RowTreeDataSource() {
  const ds = useClientTreeDataSource<FileData>({
    data: fileData.filter((c) => c.type !== "directory"),
    getPathFromData: ({ data }) => {
      const path = data ? data.path.split("/").filter((c) => !!c) : [];

      return path;
    },
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    rowGroupDefaultExpansion: true,
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
                          className="text-sm flex items-center px-2 h-full w-full text-nowrap overflow-hidden"
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
