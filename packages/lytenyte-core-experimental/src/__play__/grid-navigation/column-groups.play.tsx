import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const columns: Grid.Column[] = [
  {
    id: "age",
    groupPath: ["A", "B"],
  },
  { id: "marital", groupPath: ["A"] },
  { id: "default", groupPath: ["T"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", groupPath: ["A", "B", "C"] },
  { id: "day", groupPath: ["A", "B"] },
  { id: "month", groupPath: ["A"] },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays", groupPath: ["C"] },
  { id: "previous", groupPath: ["C", "D"] },
  { id: "poutcome", colSpan: 2 },
  { id: "y" },
];

export default function ColumnGroups({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={columns} rtl={rtl} floatingRow />;
}
