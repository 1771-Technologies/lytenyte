import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const columns: Grid.Column[] = [
  {
    id: "age",
    pin: "start",
    colSpan: (c) => {
      return c.rowIndex === 0 ? 10 : 1;
    },
  },
  { id: "marital", pin: "start" },
  { id: "default" },
  { id: "housing", colSpan: 2 },
  { id: "loan" },
  { id: "contact", pin: "end" },
  { id: "day", pin: "end" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", colSpan: 2 },
  { id: "y" },
];

export default function CellSpansWithPins({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} />;
}
