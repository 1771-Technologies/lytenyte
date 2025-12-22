import { useTheme } from "@1771technologies/play-frame";
import "@1771technologies/lytenyte-design/design.css";
import "@1771technologies/lytenyte-design/font.css";
import "@1771technologies/lytenyte-design/dark.css";
import "@1771technologies/lytenyte-design/light.css";
import "@1771technologies/lytenyte-design/teal.css";
import "@1771technologies/lytenyte-design/term.css";

import "../main.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Viewport } from "./components/viewport/viewport.js";
import { Root } from "./root/root.js";
import { Header } from "./components/header/header.js";
import { RowsContainer } from "./components/rows/rows-container/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "./components/rows/rows-section.js";
import { useClientDataSource } from "./data-source/use-client-data-source.js";
import { ViewportShadows } from "./components/viewport/viewport-shadows.js";
import { useMemo } from "react";
import { getDragData } from "./dnd/get-drag-data.js";

const columns: Root.Column[] = [
  {
    id: "age",
    name: "bob",
    groupPath: ["Alpha", "Beta"],
    type: "number",

    cellRenderer: (props) => {
      const drag = props.api.useRowDrag({ rowIndex: props.rowIndex });

      return (
        <div style={{ background: "green" }} {...drag.props}>
          Drag handle
        </div>
      );
    },
  },
  {
    id: "marital",
    groupPath: ["Alpha"],
  },
  {
    id: "default",
    groupPath: ["Top Dog"],
  },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", groupPath: ["Alpha", "Beta", "Carlson"] },
  { id: "day", groupPath: ["Alpha", "Beta"] },
  { id: "month", groupPath: ["Alpha"] },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays", groupPath: ["Carlson"] },
  { id: "previous", groupPath: ["Carlson", "Delta"] },
  { id: "poutcome" },
  { id: "y" },
];

export default function Experimental() {
  const rowSource = useClientDataSource({
    data: bankDataSmall,
  });

  const { resolvedTheme } = useTheme();
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <button>A</button>
        <div
          className={"ln-grid " + (resolvedTheme === "light" ? "ln-light" : "ln-dark")}
          style={{ height: "30vh", width: "90vw" }}
        >
          <Root
            onRowDragEnter={(p) => {
              console.log(p.over.kind === "viewport" ? "Entering viewport" : `Entering ${p.over.rowIndex}`);
            }}
            onRowDragLeave={(p) => {
              console.log(p.over.kind === "viewport" ? "Leaving viewport" : `Leaving ${p.over.rowIndex}`);
            }}
            onRowDrop={(p) => {
              console.log(p.over, p.source);
            }}
            columns={columns}
            columnBase={useMemo(() => ({ movable: true, resizable: false }), [])}
            rowSource={rowSource}
            rowGroupColumn={useMemo<Root.Props["rowGroupColumn"]>(() => {
              return {
                cellRenderer: (p) => {
                  return (
                    <div>
                      <button onClick={() => p.api.rowGroupToggle(p.row)}>{p.column.name ?? "Group"}</button>
                    </div>
                  );
                },
              };
            }, [])}
          >
            <Viewport>
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
        <button>A</button>
      </div>
      <div
        style={{ width: 200, height: 200, background: "red" }}
        onDrop={(ev) => {
          ev.preventDefault();
          const ge = getDragData();
          console.log(ge);
        }}
      ></div>
    </>
  );
}
