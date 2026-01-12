"use client";

import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import { useId } from "react";
import { getResponses, Server } from "./server";
import type { DataEntry } from "./data";
import { GridButton, GroupCell, HeaderCell, NumberCell } from "./components";
import type { Column } from "@1771technologies/lytenyte-pro/types";

const columns: Column<DataEntry>[] = [
  {
    id: "bid",
    name: "Bid",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
  },
  {
    id: "ask",
    name: "Ask",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
  },
  {
    id: "spread",
    name: "Spread",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
  },

  {
    id: "volatility",
    name: "Volatility",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
  },
  {
    id: "latency",
    name: "Latency",
    type: "number",
    groupVisibility: "always",
    cellRenderer: NumberCell,
    width: 120,
    widthFlex: 1,
  },
  {
    id: "symbol",
    name: "Symbol",
    hide: true,
    groupVisibility: "always",
    type: "number",
  },
];

export default function DataPushing() {
  const ds = useServerDataSource<DataEntry>({
    dataFetcher: (params) => {
      return Server(params.requests, params.model.groups, params.model.aggregations);
    },
    blockSize: 50,
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns: columns,
    rowGroupModel: ["symbol"],
    rowGroupColumn: {
      width: 170,
      cellRenderer: GroupCell,
    },

    columnBase: {
      headerRenderer: HeaderCell,
    },

    aggModel: {
      time: { fn: "first" },
      volume: { fn: "group" },
      bid: { fn: "avg" },
      ask: { fn: "avg" },
      spread: { fn: "avg" },
      volatility: { fn: "first" },
      latency: { fn: "first" },
      pnl: { fn: "first" },
      symbol: { fn: "first" },
    },
  });

  const view = grid.view.useValue();

  return (
    <>
      <div className="border-ln-gray-30 flex border-b px-2 py-2">
        <GridButton
          onClick={() => {
            const res = getResponses(
              ds.requestsForView.get(),
              grid.state.rowGroupModel.get(),
              grid.state.aggModel.get(),
            );
            ds.pushResponses(res);
          }}
        >
          Push Data
        </GridButton>
      </div>

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
                          className="flex h-full w-full items-center px-2 text-sm capitalize"
                        />
                      );
                    })}
                  </Grid.HeaderRow>
                );
              })}
            </Grid.Header>
            <Grid.RowsContainer className={ds.isLoading.useValue() ? "animate-pulse bg-gray-100" : ""}>
              <Grid.RowsCenter>
                {view.rows.center.map((row) => {
                  if (row.kind === "full-width") return null;

                  return (
                    <Grid.Row row={row} key={row.id}>
                      {row.cells.map((c) => {
                        return <Grid.Cell key={c.id} cell={c} />;
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
