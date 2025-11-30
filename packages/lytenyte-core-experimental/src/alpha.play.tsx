import { Header } from "./header/header.js";
import { Root } from "./root/root.js";
import type { Column } from "./types/column.js";
import { Viewport } from "./viewport.js";

const columns: Column<any>[] = [
  { id: "age" },
  { id: "job" },
  { id: "balance" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function Experimental() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ height: "90vh", width: "90vw" }}>
        <Root columns={columns}>
          <Viewport style={{ border: "1px solid white" }}>
            <Header />
          </Viewport>
        </Root>
      </div>
    </div>
  );
}
