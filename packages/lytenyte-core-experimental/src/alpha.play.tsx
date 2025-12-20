import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Viewport } from "./components/viewport/viewport.js";
import { Root } from "./root/root.js";
import { Header } from "./components/header/header.js";
import { RowsContainer } from "./components/rows/rows-container/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "./components/rows/rows-section.js";
import { useClientDataSource } from "./data-source/use-client-data-source.js";
import { useState } from "react";

type BankData = (typeof bankDataSmall)[number];

export default function Experimental() {
  const [columns, setColumns] = useState<Root.Column<BankData>[]>([
    { id: "age", name: "bob", groupPath: ["A", "B"] },
    { id: "marital", groupPath: ["A"] },
    { id: "default", groupPath: ["T"] },
    { id: "housing" },
    { id: "loan" },
    { id: "contact", groupPath: ["A", "B", "C"] },
    { id: "day", groupPath: ["A", "B"] },
    { id: "month", groupPath: ["A"] },
    { id: "duration" },
    { id: "campaign" },
    { id: "pdays", groupPath: ["C"] },
    { id: "previous", groupPath: ["C", "D"] },
    { id: "poutcome" },
    { id: "y" },
  ]);

  const rowSource = useClientDataSource({
    data: bankDataSmall,
  });

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button>A</button>
      <div style={{ height: "90vh", width: "90vw" }}>
        <Root
          columns={columns}
          onColumnsChange={setColumns}
          columnBase={{ movable: true, resizable: false }}
          rowSource={rowSource}
          columnMarkerEnabled
          rowGroupColumn={{
            cellRenderer: (p) => {
              if (p.row.kind === "leaf") return <div />;
              return (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingInline: "8px" }}>
                  <button onClick={() => p.api.rowGroupToggle(p.row)}>X</button>
                  <div>{p.row.key}</div>
                </div>
              );
            },
          }}
        >
          <Viewport style={{ border: "1px solid white" }}>
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
  );
}

// Editing
// Row Dragging
// Animations??
