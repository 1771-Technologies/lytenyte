import type { Grid } from "../../index.js";
import NormalLayout from "./normal-layout.play.js";

const baseColumns: Grid.Column[] = [
  { id: "age", pin: "start" },
  { id: "job" },
  { id: "marital" },
  { id: "housing", pin: "end" },
];

export default function PinnedGapLayout({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={baseColumns} rtl={rtl} />;
}
