import type { Column } from "../../+types";
import NormalLayout from "./normal-layout.play.js";

const baseColumns: Column<any>[] = [
  { id: "age", pin: "start" },
  { id: "job" },
  { id: "marital" },
  { id: "housing", pin: "end" },
];

export default function PinnedGapLayout({ rtl }: { rtl?: boolean }) {
  return <NormalLayout columns={baseColumns} rtl={rtl} />;
}
