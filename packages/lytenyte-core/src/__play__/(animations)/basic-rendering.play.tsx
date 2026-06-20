import "../test.css";
import { useClientDataSource, Grid } from "../../index.js";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useState } from "react";

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
export default function BasicRendering() {
  const [sort, setSort] = useState<Grid.T.DimensionSort<Spec["data"]>[] | null>([
    { dim: { id: "education" } },
  ]);

  const ds = useClientDataSource({
    data: bankDataSmall,
    sort,
  });

  return (
    <>
      <button
        onClick={() => {
          if (sort) setSort(null);
          else setSort([{ dim: { id: "education" } }]);
        }}
      >
        Sort
      </button>
      <div style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
        <Grid columns={columns} rowSource={ds} viewportInitialHeight={500} viewportInitialWidth={500} />
      </div>
    </>
  );
}
