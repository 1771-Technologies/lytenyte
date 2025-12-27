import { Grid, useClientDataSource } from "@1771technologies/lytenyte-pro-experimental";
import "@1771technologies/lytenyte-pro-experimental/grid-full.css";
import "./main.css";
import type { RequestData } from "./data.js";
import { requestData } from "./data.js";
import { DateCell } from "./components.jsx";

export interface GridSpec {
  data: RequestData;
}

const columns: Grid.Column<GridSpec>[] = [
  { id: "Date", name: "Date", width: 200, type: "datetime", cellRenderer: DateCell },
  { id: "Status", name: "Status", width: 100 },
  { id: "Method", name: "Method", width: 100 },
  { id: "timing-phase", name: "Timing Phase" },
  { id: "Pathname", name: "Pathname" },
  { id: "Latency", name: "Latency", width: 120, type: "number" },
  { id: "region", name: "Region" },
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
