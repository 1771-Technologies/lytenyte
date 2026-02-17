import "@1771technologies/lytenyte-pro/components.css";
import "@1771technologies/lytenyte-pro/light-dark.css";
import { Grid, RowGroupCell, useServerDataSource } from "@1771technologies/lytenyte-pro";

import { Server } from "./server.js";
import type { SalaryData } from "./data";
import {
  AgeCellRenderer,
  BaseCellRenderer,
  SalaryRenderer,
  YearsOfExperienceRenderer,
} from "./components.js";
import { useRef } from "react";

export interface GridSpec {
  readonly data: SalaryData;
}

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "Gender",
    width: 120,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
  },
  {
    id: "Education Level",
    name: "Education",
    width: 160,
    hide: true,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
  },
  {
    id: "Age",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: AgeCellRenderer,
  },
  {
    id: "Years of Experience",
    name: "YoE",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: YearsOfExperienceRenderer,
  },
  { id: "Salary", type: "number", width: 160, widthFlex: 1, cellRenderer: SalaryRenderer },
];

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
  pin: "start",
};

export default function ServerDataDemo() {
  const shouldFailRef = useRef<Record<string, boolean>>({});

  const ds = useServerDataSource({
    queryFn: (params) => {
      return Server(params.requests, ["Education Level"], shouldFailRef.current);
    },
    hasRowBranches: true,
    queryKey: [],
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        columns={columns}
        rowGroupColumn={group}
        slotViewportOverlay={
          isLoading && (
            <div className="bg-ln-gray-20/40 absolute left-0 top-0 z-20 h-full w-full animate-pulse"></div>
          )
        }
      />
    </div>
  );
}
