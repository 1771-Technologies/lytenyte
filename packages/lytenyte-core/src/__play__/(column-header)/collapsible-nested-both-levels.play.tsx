import "./column-header.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// Two-level groups where BOTH the outer and inner levels are independently collapsible.
//
// "Personal" (outer) — collapsible:
//   age is a direct child of "Personal" with groupVisibility "close"
//     → .open = true for "Personal" (stays visible when "Personal" collapses)
//   job/marital/education are deeper descendants (under "Personal/Details")
//     → .close = true for "Personal" (hidden when "Personal" collapses)
//   Result: both flags set → collapsible ✓
//
// "Personal/Details" (inner) — collapsible:
//   job has groupVisibility "close"        → .open = true  (stays visible on collapse)
//   marital/education use default "open"   → .close = true (hidden on collapse)
//   Result: both flags set → collapsible ✓
//
// "Financial" (outer) — collapsible:
//   balance is a direct child with groupVisibility "close" → .open = true
//   default/housing/loan are deeper descendants            → .close = true
//   Result: collapsible ✓
//
// "Financial/Banking" (inner) — collapsible:
//   default has groupVisibility "close"  → .open = true
//   housing uses default "open"          → .close = true
//   Result: collapsible ✓
//
// "Financial/Loans" (inner) — NOT collapsible:
//   loan uses default "open" → only .close = true, .open never set → not collapsible ✓
const columns: Grid.Column<Spec>[] = [
  { id: "age", groupPath: ["Personal"], groupVisibility: "close" },
  { id: "job", groupPath: ["Personal", "Details"], groupVisibility: "close" },
  { id: "marital", groupPath: ["Personal", "Details"] },
  { id: "education", groupPath: ["Personal", "Details"] },
  { id: "balance", groupPath: ["Financial"], groupVisibility: "close" },
  { id: "default", groupPath: ["Financial", "Banking"], groupVisibility: "close" },
  { id: "housing", groupPath: ["Financial", "Banking"] },
  { id: "loan", groupPath: ["Financial", "Loans"] },
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

export default function CollapsibleNestedBothLevels() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div className="column-header-demo">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
