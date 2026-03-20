import "./column-header.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// Columns are assigned to one of three single-level groups, with a few ungrouped
// columns interspersed to show mixed layouts.
const columns: Grid.Column<Spec>[] = [
  { id: "age", groupPath: ["Demographics"] },
  { id: "job", groupPath: ["Demographics"] },
  { id: "marital", groupPath: ["Demographics"] },
  { id: "education", groupPath: ["Demographics"] },
  { id: "balance", groupPath: ["Financial"] },
  { id: "default", groupPath: ["Financial"] },
  { id: "housing", groupPath: ["Financial"] },
  { id: "loan", groupPath: ["Financial"] },
  { id: "contact" },
  { id: "day", groupPath: ["Campaign"] },
  { id: "month", groupPath: ["Campaign"] },
  { id: "duration", groupPath: ["Campaign"] },
  { id: "campaign", groupPath: ["Campaign"] },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function SingleLevelGroups() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div className="column-header-demo">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
