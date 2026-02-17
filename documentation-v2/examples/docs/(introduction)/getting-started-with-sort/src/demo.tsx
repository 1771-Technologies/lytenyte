//#start
import "./main.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import {
  Grid,
  useClientDataSource,
  type UseClientDataSourceParams,
} from "@1771technologies/lytenyte-pro";

import type { RequestData } from "./data.js";
import { requestData } from "./data.js";
import {
  DateCell,
  Header,
  LatencyCell,
  MethodCell,
  PathnameCell,
  RegionCell,
  StatusCell,
  TimingPhaseCell,
} from "./components.js";
import { useMemo, useState } from "react";
import { sortComparators } from "./comparators.js";
//#end

export interface GridSpec {
  data: RequestData;
  column: { sort?: "asc" | "desc" | null };
}

const base: Grid.Props<GridSpec>["columnBase"] = {
  headerRenderer: Header,
};

export default function GettingStartedDemo() {
  const [columns, setColumns] = useState<Grid.Column<GridSpec>[]>([
    { id: "Date", name: "Date", width: 200, type: "datetime", cellRenderer: DateCell },
    { id: "Status", name: "Status", width: 100, cellRenderer: StatusCell },
    { id: "Method", name: "Method", width: 100, cellRenderer: MethodCell },
    { id: "timing-phase", name: "Timing Phase", cellRenderer: TimingPhaseCell },
    { id: "Pathname", name: "Pathname", cellRenderer: PathnameCell },
    { id: "Latency", name: "Latency", width: 120, type: "number", cellRenderer: LatencyCell },
    { id: "region", name: "Region", cellRenderer: RegionCell },
  ]);

  const sort = useMemo<UseClientDataSourceParams<GridSpec>["sort"]>(() => {
    const colWithSort = columns.find((x) => x.sort);
    if (!colWithSort) return null;

    if (sortComparators[colWithSort.id])
      return [{ dim: sortComparators[colWithSort.id], descending: colWithSort.sort === "desc" }];

    return [{ dim: colWithSort, descending: colWithSort.sort === "desc" }];
  }, [columns]);

  const ds = useClientDataSource<GridSpec>({
    data: requestData,
    sort,
  });

  return (
    <div className="demo ln-grid" style={{ height: 400 }}>
      <Grid columns={columns} onColumnsChange={setColumns} columnBase={base} rowSource={ds} />
    </div>
  );
}
