import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// Single-level groups with varying collapsibility:
//
// "Demographics" — collapsible:
//   age     groupVisibility "close"  → always visible; shown when group is collapsed
//   job     groupVisibility "open"   → hidden when group is collapsed   (default)
//   marital groupVisibility "open"   → hidden when group is collapsed   (default)
//   education groupVisibility "open" → hidden when group is collapsed   (default)
//
// "Financial" — collapsible:
//   balance groupVisibility "close"  → always visible; shown when group is collapsed
//   default groupVisibility "open"   → hidden when group is collapsed   (default)
//   housing groupVisibility "open"   → hidden when group is collapsed   (default)
//   loan    groupVisibility "always" → always visible regardless of state
//
// "Campaign" — NOT collapsible:
//   All members use the default "open" groupVisibility. A group needs at least one
//   direct child with "close" or "always" visibility to be collapsible; since none
//   exist here, the collapse toggle is not shown.
const columns: Grid.Column<Spec>[] = [
  { id: "age", groupPath: ["Demographics"], groupVisibility: "close" },
  { id: "job", groupPath: ["Demographics"] },
  { id: "marital", groupPath: ["Demographics"] },
  { id: "education", groupPath: ["Demographics"] },
  { id: "balance", groupPath: ["Financial"], groupVisibility: "close" },
  { id: "default", groupPath: ["Financial"] },
  { id: "housing", groupPath: ["Financial"] },
  { id: "loan", groupPath: ["Financial"], groupVisibility: "always" },
  { id: "contact", groupPath: ["Campaign"] },
  { id: "day", groupPath: ["Campaign"] },
  { id: "month", groupPath: ["Campaign"] },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function CollapsibleSingleLevel() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div style={{ width: "1000px", height: "600px", border: "1px solid black" }} className="with-border">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
