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
// Deterministic per-call hash so the comparator stays stable for the duration of a single sort
// pass (no live Math.random() calls inside the comparator itself), while a fresh `seed` captured
// at click time gives each "Shuffle" click a different-looking order.
function hashOrder(id: string, seed: number): number {
  let h = Math.imul(seed, 2654435761) ^ 0x9e3779b9;
  for (let i = 0; i < id.length; i++) {
    h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  }
  return h;
}

export default function BasicRendering() {
  const [sort, setSort] = useState<Grid.T.DimensionSort<Spec["data"]>[] | null>([
    { dim: { id: "education" } },
  ]);

  const ds = useClientDataSource({
    data: bankDataSmall,
    sort,
  });

  const shuffle = () => {
    const seed = Math.floor(Math.random() * 0xffffffff);
    setSort([
      {
        dim: (a: Grid.T.RowNode<Spec["data"]>, b: Grid.T.RowNode<Spec["data"]>) =>
          hashOrder(a.id, seed) - hashOrder(b.id, seed),
      },
    ]);
  };

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
      <button onClick={shuffle}>Shuffle</button>
      <div style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
        <Grid
          columns={columns}
          rowSource={ds}
          viewportInitialHeight={500}
          viewportInitialWidth={500}
          rowAlternateAttr={false}
        />
      </div>
    </>
  );
}
