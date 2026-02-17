//#start
import "./main.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro";

import type { RequestData } from "./data.js";
import { requestData } from "./data.js";

import {
  DateCell,
  LatencyCell,
  MethodCell,
  PathnameCell,
  RegionCell,
  StatusCell,
  TimingPhaseCell,
} from "./components.js";
//#end

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

export default function GettingStartedDemo() {
  const ds = useClientDataSource<GridSpec>({
    data: requestData,
  });

  return (
    <div className="ln-grid" style={{ height: 400 }}>
      <Grid columns={columns} rowSource={ds} />
    </div>
  );
}
