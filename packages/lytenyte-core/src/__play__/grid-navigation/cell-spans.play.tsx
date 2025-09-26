import type { Column } from "../../+types";
import NormalLayout from "./normal-layout.play.js";

const columns: Column<any>[] = [
  {
    id: "age",
    colSpan: (c) => {
      return c.rowIndex === 0 || c.rowIndex === 12 ? 3 : 1;
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
    rowSpan: (t) => {
      if (t.rowIndex === 4) return 3;
      if (t.rowIndex === 8) return 3;
      if (t.rowIndex === 12) return 2;
      return 1;
    },
  },
  { id: "marital" },
  { id: "default" },
  { id: "housing", colSpan: 2 },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", colSpan: 2 },
  { id: "y" },
];

export default function CellSpans({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} />;
}
