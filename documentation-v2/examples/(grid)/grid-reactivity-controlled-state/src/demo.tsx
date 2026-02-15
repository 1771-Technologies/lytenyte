//#start
import "./main.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";

import type { RequestData } from "./data.js";
import { requestData } from "./data.js";
import {
  DateCell,
  Header,
  LatencyCell,
  MarkerCell,
  MethodCell,
  PathnameCell,
  RegionCell,
  RowDetailRenderer,
  StatusCell,
  TimingPhaseCell,
} from "./components.jsx";
import { useState } from "react";

export interface GridSpec {
  data: RequestData;
}

const base: Grid.Props<GridSpec>["columnBase"] = {
  headerRenderer: Header,
};

const marker: Grid.Props<GridSpec>["columnMarker"] = {
  on: true,
  width: 40,
  headerRenderer: () => <div className="sr-only">Toggle row detail expansion</div>,
  cellRenderer: MarkerCell,
};

const columns: Grid.Column<GridSpec>[] = [
  { id: "Date", name: "Date", width: 200, type: "datetime", cellRenderer: DateCell },
  { id: "Status", name: "Status", width: 100, cellRenderer: StatusCell },
  { id: "Method", name: "Method", width: 100, cellRenderer: MethodCell },
  { id: "timing-phase", name: "Timing Phase", cellRenderer: TimingPhaseCell },
  { id: "Pathname", name: "Pathname", cellRenderer: PathnameCell },
  { id: "Latency", name: "Latency", width: 120, type: "number", cellRenderer: LatencyCell },
  { id: "region", name: "Region", cellRenderer: RegionCell },
];

//#end
export default function ControlledRowState() {
  const ds = useClientDataSource<GridSpec>({
    data: requestData,
  });

  const [rowDetailExpansions, setRowDetailExpansions] = useState<Set<string>>(new Set()); //!

  return (
    <div className="demo ln-grid" style={{ height: 400 }}>
      <Grid
        columns={columns}
        columnBase={base}
        rowSource={ds}
        rowDetailRenderer={RowDetailRenderer}
        columnMarker={marker}
        rowDetailExpansions={rowDetailExpansions} //!
        onRowDetailExpansionsChange={setRowDetailExpansions} //!
      />
    </div>
  );
}
