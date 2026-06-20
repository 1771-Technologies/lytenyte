import "../test.css";
import { useClientDataSource, Grid } from "../../index.js";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";
import { useState } from "react";

// bankDataSmall rows have no natural unique key, so by default the grid assigns leaf ids based on
// array index - meaning an insertion would shift every later row's id and make them all look like
// delete+add instead of move. __id gives each row a stable identity independent of position.
type Row = (typeof bankDataSmall)[number] & { __id: number };

interface Spec {
  readonly data: Row;
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

const initialData: Row[] = bankDataSmall.map((r, i) => ({ ...r, __id: i }));

// Module-level counter so every "Add" click gets a fresh id, never reused, regardless of how many
// rows currently exist or have been removed.
let nextRowId = initialData.length;

function makeNewRow(): Row {
  const id = nextRowId++;
  return {
    age: 0,
    job: `New Row ${id}`,
    marital: "Unknown",
    education: "Unknown",
    default: "No",
    balance: 0,
    housing: "No",
    loan: "No",
    contact: "Unknown",
    day: 1,
    month: "Jan",
    duration: 0,
    campaign: "0",
    pdays: "-1",
    previous: "0",
    poutcome: "Unknown",
    y: "No",
    __id: id,
  };
}

export default function BasicRendering() {
  const [data, setData] = useState<Row[]>(initialData);
  const [sort, setSort] = useState<Grid.T.DimensionSort<Spec["data"]>[] | null>([
    { dim: { id: "education" } },
  ]);

  const ds = useClientDataSource({
    data,
    // sort,
    leafIdFn: (row) => String(row.__id),
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

  const addTop = () => setData((prev) => [makeNewRow(), ...prev]);
  const addAt4 = () => setData((prev) => [...prev.slice(0, 4), makeNewRow(), ...prev.slice(4)]);

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
      <button onClick={addTop}>Add Top</button>
      <button onClick={addAt4}>Add at 4</button>
      <div style={{ width: "80%", height: "500px", border: "1px solid black" }}>
        <Grid
          columns={columns}
          rowSource={ds}
          viewportInitialHeight={500}
          viewportInitialWidth={500}
          rowAlternateAttr={false}
          rowOverscanTop={0}
          rowOverscanBottom={0}
          rowHeight={50}
          rowAnimate={true}
        />
      </div>
    </>
  );
}
