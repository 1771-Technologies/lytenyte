import "./test.css";
import { useState } from "react";
import { Grid, useClientDataSource } from "../index.js";
import { bankDataSmall } from "@1771technologies/grid-sample-data/bank-data-smaller";

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const columns: Grid.Column[] = [
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

export default function RowAnimationsPlay() {
  const [data, setData] = useState(bankDataSmall);

  const ds = useClientDataSource({ data });

  const handleShuffle = () => setData((d) => shuffle([...d]));
  const handleSortByAge = () => setData((d) => [...d].sort((a, b) => b.age - a.age));
  const handleSortByMarital = () => setData((d) => [...d].sort((a, b) => a.marital.localeCompare(b.marital)));
  const handleReset = () => setData(bankDataSmall);

  const handleAddRow = () =>
    setData((d) => [{ ...bankDataSmall[Math.floor(Math.random() * bankDataSmall.length)] }, ...d]);

  const handleRemoveFirst = () => setData((d) => (d.length > 1 ? d.slice(1) : d));
  const handleRemoveLast = () => setData((d) => (d.length > 1 ? d.slice(0, -1) : d));

  return (
    <div style={{ fontFamily: "sans-serif", padding: 16 }}>
      <div style={{ marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={handleShuffle}>Shuffle</button>
        <button onClick={handleSortByAge}>Sort by age ↓</button>
        <button onClick={handleSortByMarital}>Sort by marital A→Z</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleAddRow}>Add row</button>
        <button onClick={handleRemoveFirst}>Remove first</button>
        <button onClick={handleRemoveLast}>Remove last</button>
      </div>

      <div style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
        <Grid columns={columns} rowSource={ds} animate />
      </div>
    </div>
  );
}
