import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// The same group paths appear in multiple pin sections (start, center, end).
// Because pin sections are boundaries, each pin section creates its own isolated
// group cell even when the group path is identical across sections.
//
// "Info"     appears in: start, center, end
// "Financial" appears in: center, end
const columns: Grid.Column<Spec>[] = [
  // Start pin
  { id: "age", pin: "start", groupPath: ["Info"], width: 100 },
  { id: "job", pin: "start", groupPath: ["Info"], width: 100 },

  // Center (scrollable)
  { id: "marital", groupPath: ["Info"] },
  { id: "balance", groupPath: ["Financial"] },
  { id: "default", groupPath: ["Financial"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", groupPath: ["Info"] },
  { id: "day" },
  { id: "month", groupPath: ["Financial"] },
  { id: "duration" },
  { id: "campaign" },

  // End pin
  { id: "pdays", pin: "end", groupPath: ["Info"], width: 100 },
  { id: "previous", pin: "end", groupPath: ["Info"], width: 100 },
  { id: "y", pin: "end", groupPath: ["Financial"], width: 100 },
];

export default function GroupsAcrossPins() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div style={{ width: "100%", height: "90vh", border: "1px solid black" }} className="with-border">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
