import { makeStore } from "@1771technologies/grid-store-community";
import { LyteNyteCommunity } from "../src/lytenyte-community";

const grid = makeStore({
  gridId: "x",
});
export default function Play() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <LyteNyteCommunity grid={grid} />
    </div>
  );
}
