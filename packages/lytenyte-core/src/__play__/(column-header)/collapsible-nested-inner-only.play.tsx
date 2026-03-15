import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// Two-level groups where only the INNER level is collapsible.
//
// "Personal" (outer) — NOT collapsible:
//   All columns under "Personal" are deeper descendants (they all have
//   groupPath length ≥ 2), so "Personal" has no direct child columns.
//   Without a direct child with "close"/"always" visibility, .open is never
//   set → not collapsible ✓
//
// "Personal/Details" (inner) — collapsible:
//   age has groupVisibility "close"  → .open = true  (stays visible on collapse)
//   job/marital use default "open"   → .close = true (hidden on collapse)
//   Result: both flags set → collapsible ✓
//
// "Financial/Banking" (inner) — collapsible:
//   balance has groupVisibility "close" → .open = true
//   default uses default "open"         → .close = true
//   Result: collapsible ✓
const columns: Grid.Column<Spec>[] = [
  { id: "age", groupPath: ["Personal", "Details"], groupVisibility: "close" },
  { id: "job", groupPath: ["Personal", "Details"] },
  { id: "marital", groupPath: ["Personal", "Details"] },
  { id: "education", groupPath: ["Personal", "Details"] },
  { id: "balance", groupPath: ["Financial", "Banking"], groupVisibility: "close" },
  { id: "default", groupPath: ["Financial", "Banking"] },
  { id: "housing", groupPath: ["Financial", "Banking"] },
  { id: "loan", groupPath: ["Financial", "Loans"], groupVisibility: "close" },
  { id: "contact", groupPath: ["Financial", "Loans"] },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function CollapsibleNestedInnerOnly() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div style={{ width: "1000px", height: "600px", border: "1px solid black" }} className="with-border">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
