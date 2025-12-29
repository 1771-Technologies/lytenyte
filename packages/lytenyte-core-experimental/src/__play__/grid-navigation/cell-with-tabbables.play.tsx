import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const columns: Grid.Column[] = [
  {
    id: "age",
    colSpan: (c) => {
      return c.rowIndex === 0 || c.rowIndex === 12 ? 3 : 1;
    },
    cellRenderer: () => {
      return (
        <>
          <button tabIndex={0}>A</button>
          <button tabIndex={0}>B</button>
          <button tabIndex={0}>C</button>
        </>
      );
    },
  },
  {
    id: "job",
    colSpan: (c) => {
      return c.rowIndex === 2 ? 3 : 1;
    },
  },
  { id: "balance" },
  {
    id: "education",
    colSpan: (t) => {
      if (t.rowIndex === 4) return 2;
      if (t.rowIndex === 12) return 2;
      return 1;
    },
    cellRenderer: () => {
      return (
        <>
          <button tabIndex={0}>Prev</button>
          <button tabIndex={-1}>Not Tabbable</button>
          <button tabIndex={0}>Next</button>
        </>
      );
    },
    rowSpan: (t) => {
      if (t.rowIndex === 4) return 3;
      if (t.rowIndex === 8) return 3;
      if (t.rowIndex === 12) return 2;
      return 1;
    },
  },
  { id: "marital" },
  { id: "default" },
];

export default function CellWithTabbables({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} />;
}
