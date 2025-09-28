import type { Column } from "../../+types";
import NormalLayout from "./normal-layout.play.js";

const columns: Column<any>[] = [
  {
    id: "age",
    colSpan: (c) => {
      return c.rowIndex === 0 ? 10 : 1;
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

export default function CellSpansLarge({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} />;
}
