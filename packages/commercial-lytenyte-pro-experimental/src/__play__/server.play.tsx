import { useTheme } from "@1771technologies/play-frame";
import "@1771technologies/lytenyte-design/design.css";
import "@1771technologies/lytenyte-design/font.css";
import "@1771technologies/lytenyte-design/dark.css";
import "@1771technologies/lytenyte-design/light.css";
import "@1771technologies/lytenyte-design/teal.css";
import "@1771technologies/lytenyte-design/term.css";

import "../../main.css";
import { Header, Root, RowsBottom, RowsCenter, RowsContainer, RowsTop, Viewport } from "../index.parts.js";
import { ViewportShadows } from "@1771technologies/lytenyte-core-experimental";
import { useRef, useState } from "react";
import type { API, Column, GridSpec, Props } from "../types";
import { RowGroupCell } from "../components/row-group-cell.js";
import type { SalaryData } from "./basic-server-data/data";
import { useServerDataSource } from "../data-source-server/use-server-data-source.js";
import { Server } from "./basic-server-data/server.js";

interface Spec extends GridSpec {
  data: SalaryData;
}

const columns: Column<Spec>[] = [
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
  const ds = useServerDataSource({
    rowsIsolatedSelection: false,
    rowGroupDefaultExpansion: true,

    queryFn: async ({ requests }) => {
      return Server(requests, ["Education Level", "Age"]);
    },
    queryKey: [],
  });

  const [rowGroupColumn, setRowGroupColumn] = useState<Props<Spec>["rowGroupColumn"]>({
    cellRenderer: RowGroupCell,
  });

  const isLoading = ds.isLoading.useValue();
  const error = ds.loadingError.useValue();

  const { resolvedTheme } = useTheme();

  const ref = useRef<API<Spec>>(null);
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
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className={"ln-grid " + (resolvedTheme === "light" ? "ln-light" : "ln-dark")}
          style={{ height: "90vh", width: "90vw" }}
        >
          <Root
            columns={columns}
            rowSource={ds}
            rowGroupColumn={rowGroupColumn}
            onRowGroupColumnChange={setRowGroupColumn}
            rowSelectionMode="multiple"
            ref={ref}
          >
            <Viewport style={{ scrollbarGutter: "stable" }}>
              <ViewportShadows />
              <Header />
              <RowsContainer>
                <RowsTop />
                <RowsCenter />
                <RowsBottom />
              </RowsContainer>
            </Viewport>
          </Root>
        </div>
      </div>
    </>
  );
}
