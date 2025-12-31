"use client";

import { DropWrap, Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { DragDotsSmallIcon, DragIcon } from "@1771technologies/lytenyte-pro/icons";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useId, useState } from "react";
import { BalanceCell, DurationCell, NumberCell, tw } from "./components";

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

export default function RowDraggingExternalDropZone() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });

  const [dropped, setDropped] = useState<BankData[]>([]);

  const upper = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
    columnBase: { width: 100 },

    columnMarkerEnabled: true,
    columnMarker: {
      cellRenderer: (p) => {
        const drag = p.grid.api.useRowDrag({
          placeholder: (_, el) => el.parentElement?.parentElement ?? el,
          getDragData: () => {
            return {
              siteLocalData: {
                row: p.row.data as BankData,
              },
            };
          },
          onDrop: (p) => {
            setDropped((prev) => [...prev, p.state.siteLocalData?.row as BankData]);
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

  const grid = upper.view.useValue();

  return (
    <div className="flex flex-col gap-8">
      <div className="lng-grid" style={{ height: 200 }}>
        <Grid.Root grid={upper}>
          <Grid.Viewport>
            <Grid.Header>
              {grid.header.layout.map((row, i) => {
                return (
                  <Grid.HeaderRow key={i} headerRowIndex={i}>
                    {row.map((c) => {
                      if (c.kind === "group") return null;

                      return (
                        <Grid.HeaderCell
                          key={c.id}
                          cell={c}
                          className={tw(
                            "flex items-center px-2 text-sm capitalize",
                            c.column.type === "number" && "justify-end",
                          )}
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer>
              <Grid.RowsCenter>
                {grid.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return (
                          <Grid.Cell
                            key={c.id}
                            cell={c}
                            className={tw(
                              "flex items-center px-2 text-sm",
                              c.column.type === "number" && "justify-end tabular-nums",
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

      <DropWrap
        accepted={["row"]}
        className="data-[ln-can-drop=true]:border-ln-primary-50 overflow-auto border border-dashed"
        style={{ height: 200 }}
      >
        {dropped.length === 0 && (
          <div className="flex h-full w-full items-center justify-center">
            <DragIcon className="size-8" />
            <div className="text-center">Drag a row here</div>
          </div>
        )}
        {dropped.map((c, i) => {
          return (
            <div className="flex items-center gap-2 text-nowrap px-2 py-1" key={i}>
              <span className="text-ln-gray-100 font-semibold">Row Value:</span>{" "}
              <span className="font-mono">{JSON.stringify(c)}</span>
            </div>
          );
        })}
      </DropWrap>
    </div>
  );
}
