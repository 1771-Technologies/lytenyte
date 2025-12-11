"use client";

import "./main.css";
import { Grid, useClientRowDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type { Column } from "@1771technologies/lytenyte-pro/types";
import { useId } from "react";
import {
  DateCell,
  Header,
  LatencyCell,
  MethodCell,
  PathnameCell,
  RegionCell,
  RowDetailRenderer,
  StatusCell,
  TimingPhaseCell,
} from "./components.js";
import { type RequestData, requestData } from "./data.js";
import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";

const columns: Column<RequestData>[] = [
  {
    id: "Date",
    name: "Date",
    width: 200,
    cellRenderer: DateCell,
    type: "datetime",
  },
  { id: "Status", name: "Status", width: 100, cellRenderer: StatusCell },
  {
    id: "Method",
    name: "Method",
    width: 100,
    cellRenderer: MethodCell,
  },
  { id: "timing-phase", name: "Timing Phase", cellRenderer: TimingPhaseCell },
  { id: "Pathname", name: "Pathname", cellRenderer: PathnameCell },
  {
    id: "Latency",
    name: "Latency",
    width: 120,
    cellRenderer: LatencyCell,
    type: "number",
  },
  { id: "region", name: "Region", cellRenderer: RegionCell },
];

export default function Demo() {
  const ds = useClientRowDataSource<RequestData>({
    data: requestData,
  });
  const grid = Grid.useLyteNyte({
    gridId: useId(),
    columns,

    rowDetailHeight: 200,
    rowDetailRenderer: RowDetailRenderer,

    columnMarkerEnabled: true,
    columnMarker: {
      width: 40,
      cellRenderer: ({ row, grid }) => {
        const isExpanded = grid.api.rowDetailIsExpanded(row);
        return (
          <button
            className="text-ln-gray-70 flex h-full w-[calc(100%-1px)] items-center justify-center pl-2"
            onClick={() => grid.api.rowDetailToggle(row)}
          >
            {isExpanded ? (
              <ChevronDownIcon width={20} height={20} />
            ) : (
              <ChevronRightIcon width={20} height={20} />
            )}
          </button>
        );
      },
    },

    columnBase: {
      headerRenderer: Header,
    },

    rowDataSource: ds,
  });

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ width: "100%", height: "400px" }}>
      <Grid.Root grid={grid}>
        <Grid.Viewport>
          <Grid.Header>
            {view.header.layout.map((row, i) => {
              return (
                <Grid.HeaderRow headerRowIndex={i} key={i}>
                  {row.map((c) => {
                    if (c.kind === "group")
                      return <Grid.HeaderGroupCell cell={c} key={c.idOccurrence} />;

                    return (
                      <Grid.HeaderCell cell={c} key={c.column.id} className="after:bg-ln-gray-20" />
                    );
                  })}
                </Grid.HeaderRow>
              );
            })}
          </Grid.Header>

          <Grid.RowsContainer>
            <Grid.RowsCenter>
              {view.rows.center.map((row) => {
                if (row.kind === "full-width") return <Grid.RowFullWidth row={row} key={row.id} />;

                return (
                  <Grid.Row key={row.id} row={row} accepted={["row"]}>
                    {row.cells.map((cell) => {
                      return <Grid.Cell cell={cell} key={cell.id} />;
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
