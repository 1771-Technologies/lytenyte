import { makeStore } from "@1771technologies/grid-store-enterprise";
import { columns } from "./helpers";
import { GridFrame } from "../src/grid-frame/grid-frame";

const grid = makeStore({
  columns,
  columnBase: { sortable: true },
  gridId: "x",

  panelFrames: {
    sort: {
      title: "Sort",
      component: () => <div>Test Frame here</div>,
    },
  },
  panelFrameButtons: [{ id: "sort", label: "Sort", icon: () => "X" }],
});

grid.api.panelFrameOpen("sort");

export default function Home() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GridFrame grid={grid}>Grid goes here</GridFrame>
    </div>
  );
}
