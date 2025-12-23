import { useTheme } from "@1771technologies/play-frame";
import "@1771technologies/lytenyte-design/design.css";
import "@1771technologies/lytenyte-design/font.css";
import "@1771technologies/lytenyte-design/dark.css";
import "@1771technologies/lytenyte-design/light.css";
import "@1771technologies/lytenyte-design/teal.css";
import "@1771technologies/lytenyte-design/term.css";

import "../main.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Header, Root, RowsBottom, RowsCenter, RowsContainer, RowsTop, Viewport } from "./index.parts.js";
import { ViewportShadows } from "@1771technologies/lytenyte-core-experimental";
import { useClientDataSource } from "./data-source-client/use-client-data-source.js";
import { useMemo } from "react";

type BankData = (typeof bankDataSmall)[number];

const columns: Root.Column<{ data: BankData }>[] = [
  { id: "age", name: "bob", groupPath: ["Alpha", "Beta"], type: "number" },
  { id: "marital", groupPath: ["Alpha"] },
  { id: "default", groupPath: ["Top Dog"] },
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
          style={{ height: "90vh", width: "90vw" }}
        >
          <Root
            columns={columns}
            columnBase={useMemo(() => ({ movable: true, resizable: false }), [])}
            rowSource={rowSource}
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
    </>
  );
}
