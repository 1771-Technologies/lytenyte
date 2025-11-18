"use client";

import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { DragDotsSmallIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "education" },
  { id: "marital" },
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day", type: "number" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

export default function RowDraggingBetweenGrids() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const upper = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnMarkerEnabled: true,
    columnMarker: {
      cellRenderer: (p) => {
        const drag = p.grid.api.useRowDrag({
          getDragData: () => {
            return {
              siteLocalData: {
                row: p.rowIndex,
              },
            };
          },
          onDrop: (p) => {
            alert(
              `Dropped row at ${p.state.siteLocalData?.row ?? ""} ${
                p.moveState.topHalf ? "before" : "after"
              } row ${p.dropElement.getAttribute("data-ln-rowindex")}`,
            );
          },
        });

        return (
          <span {...drag.dragProps}>
            <DragDotsSmallIcon />
          </span>
        );
      },
    },
  });

  const lower = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,

    columnMarkerEnabled: true,
    columnMarker: {
      cellRenderer: (p) => {
        const drag = p.grid.api.useRowDrag({
          getDragData: () => {
            return {
              siteLocalData: {
                row: p.rowIndex,
              },
            };
          },
          onDrop: (p) => {
            alert(
              `Dropped row at ${p.state.siteLocalData?.row ?? ""} ${
                p.moveState.topHalf ? "before" : "after"
              } row ${p.dropElement.getAttribute("data-ln-rowindex")}`,
            );
          },
        });

        return (
          <span {...drag.dragProps}>
            <DragDotsSmallIcon />
          </span>
        );
      },
    },
  });

  const viewUpper = upper.view.useValue();
  const viewLower = lower.view.useValue();

  return (
    <div className="flex flex-col gap-8">
      <div className="lng-grid" style={{ height: 200 }}>
        <Grid.Root grid={upper}>
          <Grid.Viewport>
            <Grid.Header>
              {viewUpper.header.layout.map((row, i) => {
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
              <Grid.RowsCenter>
                {viewUpper.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id} accepted={["row"]}>
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

      <div className="lng-grid" style={{ height: 200 }}>
        <Grid.Root grid={lower}>
          <Grid.Viewport>
            <Grid.Header>
              {viewLower.header.layout.map((row, i) => {
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
              <Grid.RowsCenter>
                {viewLower.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id} accepted={["row"]}>
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
    </div>
  );
}
