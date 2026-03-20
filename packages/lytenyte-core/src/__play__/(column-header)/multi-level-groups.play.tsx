import "./column-header.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";
import { ColumnGroupRenderer } from "./column-group-renderer.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

// Columns are nested 2–3 levels deep. "Demographics" has two sub-groups ("Personal"
// and "Education"). "Financial" has two sub-groups ("Banking" and "Loans").
// "Campaign" goes three levels deep under "Campaign > Timing > Date", while some
// columns sit at shallower levels of the same tree.
const columns: Grid.Column<Spec>[] = [
  { id: "age", groupPath: ["Demographics", "Personal"] },
  { id: "job", groupPath: ["Demographics", "Personal"] },
  { id: "marital", groupPath: ["Demographics", "Personal"] },
  { id: "education", groupPath: ["Demographics", "Education"] },
  { id: "balance", groupPath: ["Financial", "Banking"] },
  { id: "default", groupPath: ["Financial", "Banking"] },
  { id: "housing", groupPath: ["Financial", "Loans"] },
  { id: "loan", groupPath: ["Financial", "Loans"] },
  { id: "contact" },
  { id: "day", groupPath: ["Campaign", "Timing", "Date"] },
  { id: "month", groupPath: ["Campaign", "Timing", "Date"] },
  { id: "duration", groupPath: ["Campaign", "Timing"] },
  { id: "campaign", groupPath: ["Campaign"] },
  { id: "pdays", groupPath: ["Campaign"] },
  { id: "previous", groupPath: ["Campaign"] },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

export default function MultiLevelGroups() {
  const ds = useClientDataSource({ data: bankDataSmall });

  return (
    <div className="column-header-demo">
      <Grid columns={columns} rowSource={ds} columnGroupRenderer={ColumnGroupRenderer} />
    </div>
  );
}
