import "../test.css";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { Grid, useClientDataSource } from "../../index.js";

interface Spec {
  readonly data: (typeof bankDataSmall)[number];
}

const columns: Grid.Column<Spec>[] = [
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

export default function FlatColumns() {
  const ds = useClientDataSource({
    data: bankDataSmall,
  });

  return (
    <div style={{ width: "800px", height: "1000px", border: "1px solid black" }}>
      <Grid columns={columns} rowSource={ds} />
    </div>
  );
}
