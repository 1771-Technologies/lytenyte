import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// Non-adjacent groups that are also collapsible. The same logical group ("A" or "B")
// appears in multiple non-contiguous runs, creating separate visual group cells.
// Because collapsibility is a property of the logical group (not the visual cell),
// all visual instances share the same collapsed/expanded state and all show the
// collapse toggle.
//
// Group "A" — collapsible:
//   age/housing have groupVisibility "close"  → .open = true  (always visible)
//   job/loan/month have default "open"        → .close = true (hidden on collapse)
//
// Group "B" — collapsible:
//   marital has groupVisibility "close"       → .open = true
//   education/contact/campaign default "open" → .close = true
//
// Layout:
//   A  A  B  B  –  –  A  A  B  –  A  B  B  –  –  –  –
const columns: Grid.Column<Spec>[] = [
  // First run of A and B
  { id: "age", groupPath: ["A"], groupVisibility: "close" },
  { id: "job", groupPath: ["A"] },
  { id: "marital", groupPath: ["B"], groupVisibility: "close" },
  { id: "education", groupPath: ["B"] },
  // Gap
  { id: "balance" },
  { id: "default" },
  // Second run of A and B
  { id: "housing", groupPath: ["A"], groupVisibility: "close" },
  { id: "loan", groupPath: ["A"] },
  { id: "contact", groupPath: ["B"] },
  // Gap
  { id: "day" },
  // Third run of A and B
  { id: "month", groupPath: ["A"] },
  { id: "duration", groupPath: ["B"] },
  { id: "campaign", groupPath: ["B"] },
  // Ungrouped tail
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function CollapsibleNonAdjacent() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div style={{ width: "1000px", height: "600px", border: "1px solid black" }} className="with-border">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
