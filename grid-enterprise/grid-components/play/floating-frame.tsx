import { makeStore } from "@1771technologies/grid-store-enterprise";
import { bankColumns } from "./helpers";
import { GridProvider } from "../src/provider/grid-provider";
import { ColumnManagerFrame } from "../src/column-manager/column-manager-frame";
import { t } from "@1771technologies/grid-design";
import { FloatingFrameDriver } from "../src/floating-frame/floating-frame-driver";
import { useCallback } from "react";

const grid = makeStore({
  gridId: "x",
  columns: bankColumns,
  columnBase: { sortable: true, movable: true, measureFnsAllowed: ["avg"] },
  rowGroupModel: ["education", "day"],
  columnPivotModel: ["loan"],
  measureModel: ["poutcome"],
  floatingFrames: {
    "column-manager": {
      w: 705,
      h: 700,
      component: () => <ColumnManagerFrame showPivotToggle />,
      title: "Column Manager",
    },
  },
});

export default function Home() {
  const setVp = useCallback((el: HTMLElement | null) => {
    if (!el) return;

    grid.state.internal.viewport.set(el);
  }, []);
  return (
    <GridProvider grid={grid}>
      <FloatingFrameDriver />
      <div style={{ width: "100vw", height: "100vh", background: t.colors.gray_00 }} ref={setVp}>
        <button onClick={() => grid.api.floatingFrameOpen("column-manager")}>Show Frame</button>
      </div>
    </GridProvider>
  );
}
