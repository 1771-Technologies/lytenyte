import { useTheme } from "@1771technologies/play-frame";
import "@1771technologies/lytenyte-design/design.css";
import "@1771technologies/lytenyte-design/font.css";
import "@1771technologies/lytenyte-design/dark.css";
import "@1771technologies/lytenyte-design/light.css";
import "@1771technologies/lytenyte-design/teal.css";
import "@1771technologies/lytenyte-design/term.css";

import "../../main.css";
import { useRef, useState } from "react";
import { RowGroupCell } from "../components/row-group-cell.js";
import type { SalaryData } from "./basic-server-data/data";
import { useServerDataSource, type RowSourceServer } from "../data-source-server/use-server-data-source.js";
import { Server } from "./basic-server-data/server.js";
import { Grid } from "../index.js";

interface Spec extends Grid.GridSpec {
  data: SalaryData;
  source: RowSourceServer<SalaryData>;
}

const columns: Grid.Column<Spec>[] = [
  {
    id: "Gender",
    width: 120,
    widthFlex: 1,
  },
  {
    id: "Education Level",
    name: "Education",
    width: 160,
    hide: true,
    widthFlex: 1,
  },
  {
    id: "Age",
    type: "number",
    width: 100,
    widthFlex: 1,
  },
  {
    id: "Years of Experience",
    name: "YoE",
    type: "number",
    width: 100,
    widthFlex: 1,
  },
  { id: "Salary", type: "number", width: 160, widthFlex: 1 },
];
export default function Experimental() {
  const ds = useServerDataSource<SalaryData>({
    rowGroupDefaultExpansion: true,
    queryFn: async ({ requests }) => {
      return Server(requests, []);
    },
    queryKey: [],
    rowUpdateOptimistically: true,
    onRowsAdded: async () => {
      //
    },
    onRowsDeleted: async () => {},
  });

  const [rowGroupColumn, setRowGroupColumn] = useState<Grid.Props<Spec>["rowGroupColumn"]>({
    cellRenderer: RowGroupCell,
  });

  const isLoading = ds.isLoading.useValue();
  const error = ds.loadingError.useValue();

  const { resolvedTheme } = useTheme();

  const ref = useRef<Grid.API<Spec>>(null);
  return (
    <>
      <div style={{ height: 40 }}>
        <>
          {isLoading && <div>Loading...</div>}
          {error && <div>{`${error}`}</div>}
        </>
        <button
          onClick={() => {
            ref.current?.rowSelect({ selected: "all" });
          }}
        >
          Select All
        </button>
        <button
          onClick={() =>
            ref.current?.rowAdd([{ id: crypto.randomUUID(), data: {} as SalaryData, kind: "leaf" }])
          }
        >
          Add Row
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className={"ln-grid " + (resolvedTheme === "light" ? "ln-light" : "ln-dark")}
          style={{ height: "90vh", width: "90vw" }}
        >
          <Grid
            columns={columns}
            rowSource={ds}
            rowGroupColumn={rowGroupColumn}
            onRowGroupColumnChange={setRowGroupColumn}
            columnMarkerEnabled
            columnMarker={{
              cellRenderer: ({ api, row }) => {
                return <button onClick={() => api.rowDelete([row])}>X</button>;
              },
            }}
            ref={ref}
          />
        </div>
      </div>
    </>
  );
}
