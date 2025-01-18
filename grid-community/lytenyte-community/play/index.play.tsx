import { makeStore } from "@1771technologies/grid-store-community";
import { LyteNyteCommunity } from "../src/lytenyte-community";
import { columns } from "./data/columns";
import { bankDataSmall } from "./data/bank-data-small";

const grid = makeStore({
  gridId: "x",
  columns: columns,
  rowDataSource: {
    kind: "client",
    data: bankDataSmall,
  },
});
export default function Play() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LyteNyteCommunity grid={grid} />
    </div>
  );
}
