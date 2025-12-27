"use client";
//# start
import "./main.css";
import "@1771technologies/lytenyte-pro-experimental/grid-full.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";

import type { RequestData } from "./data";
import { requestData } from "./data";
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
} from "./components";
import { ChevronDownIcon, ChevronRightIcon } from "@radix-ui/react-icons";
//# end

export interface GridSpec {
  data: RequestData;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "Date", name: "Date", width: 200, type: "datetime", cellRenderer: DateCell },
  { id: "Status", name: "Status", width: 100, cellRenderer: StatusCell },
  { id: "Method", name: "Method", width: 100, cellRenderer: MethodCell },
  { id: "timing-phase", name: "Timing Phase", cellRenderer: TimingPhaseCell },
  { id: "Pathname", name: "Pathname", cellRenderer: PathnameCell },
  { id: "Latency", name: "Latency", width: 120, type: "number", cellRenderer: LatencyCell },
  { id: "region", name: "Region", cellRenderer: RegionCell },
];

const base: Grid.Props<GridSpec>["columnBase"] = {
  headerRenderer: Header,
};

const marker: Grid.Props<GridSpec>["columnMarker"] = {
  on: true,
  width: 40,
  cellRenderer: ({ api, row }) => {
    const isExpanded = api.rowDetailExpanded(row);
    return (
      <button
        className="text-ln-text-dark flex h-full w-[calc(100%-1px)] items-center justify-center pl-2"
        onClick={() => api.rowDetailToggle(row)}
      >
        {isExpanded ? (
          <ChevronDownIcon width={20} height={20} />
        ) : (
          <ChevronRightIcon width={20} height={20} />
        )}
      </button>
    );
  },
};

export default function GettingStartedDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: requestData,
  });

  return (
    <div className="ln-grid" style={{ height: 400 }}>
      <Grid
        columnBase={base}
        columns={columns}
        rowSource={ds}
        rowDetailRenderer={RowDetailRenderer}
        columnMarker={marker}
      />
    </div>
  );
}
