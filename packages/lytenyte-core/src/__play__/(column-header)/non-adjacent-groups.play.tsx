import "./column-header.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// Groups "A" and "B" each appear multiple times, separated by ungrouped columns.
// Because members of the same group path are non-adjacent, the grid renders them
// as visually split group cells while still treating them as the same logical group.
//
// Layout (group membership):
//   A  A  B  B  –  –  A  A  B  –  A  B  B  –  –  –  –
const columns: Grid.Column<Spec>[] = [
  { id: "age", groupPath: ["A"] },
  { id: "job", groupPath: ["A"] },
  { id: "marital", groupPath: ["B"] },
  { id: "education", groupPath: ["B"] },
  { id: "balance" },
  { id: "default" },
  { id: "housing", groupPath: ["A"] },
  { id: "loan", groupPath: ["A"] },
  { id: "contact", groupPath: ["B"] },
  { id: "day" },
  { id: "month", groupPath: ["A"] },
  { id: "duration", groupPath: ["B"] },
  { id: "campaign", groupPath: ["B"] },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function NonAdjacentGroups() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div className="column-header-demo">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
