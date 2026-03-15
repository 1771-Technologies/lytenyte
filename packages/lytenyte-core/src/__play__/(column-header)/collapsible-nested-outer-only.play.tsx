import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// Two-level groups where only the OUTER level is collapsible.
//
// Collapsibility is determined per group:
//   • A group is collapsible when it has ≥1 direct child with "close"/"always" visibility
//     (stays visible on collapse) AND ≥1 child that disappears on collapse.
//
// "Personal" (outer) — collapsible:
//   age is a direct child of "Personal" with groupVisibility "close" → .open = true
//   job/marital/education are deeper (under "Personal/Details") → .close = true for "Personal"
//   Result: both flags set → collapsible ✓
//
// "Personal/Details" (inner) — NOT collapsible:
//   All direct children (job, marital, education) use default "open" groupVisibility
//   → only .close = true, .open never set → not collapsible ✓
const columns: Grid.Column<Spec>[] = [
  { id: "age", groupPath: ["Personal"], groupVisibility: "close" },
  { id: "job", groupPath: ["Personal", "Details"] },
  { id: "marital", groupPath: ["Personal", "Details"] },
  { id: "education", groupPath: ["Personal", "Details"] },
  { id: "balance", groupPath: ["Financial"], groupVisibility: "close" },
  { id: "default", groupPath: ["Financial", "Banking"] },
  { id: "housing", groupPath: ["Financial", "Banking"] },
  { id: "loan", groupPath: ["Financial", "Loans"] },
  { id: "contact" },
  { id: "day", groupPath: ["Campaign", "Timing"] },
  { id: "month", groupPath: ["Campaign", "Timing"] },
  { id: "duration", groupPath: ["Campaign", "Timing"] },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function CollapsibleNestedOuterOnly() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div style={{ width: "1000px", height: "600px", border: "1px solid black" }} className="with-border">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
