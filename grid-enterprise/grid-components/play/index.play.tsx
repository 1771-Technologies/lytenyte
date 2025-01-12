import { makeStore } from "@1771technologies/grid-store-enterprise";
import { columns } from "./helpers";
import { SortFloatingFrame } from "../src/sort-manager/sort-frame";
import { FloatingFrameDriver } from "../src/floating-frame/floating-frame-driver";
import { useCallback, useEffect } from "react";
import { GridProvider } from "../src/provider/grid-provider";

const grid = makeStore({
  columns,
  columnBase: { sortable: true },

  floatingFrames: {
    sort: {
      component: SortFloatingFrame,
      title: "Sort",
    },
  },
});

export default function Home() {
  useEffect(() => {
    grid.api.floatingFrameOpen("sort");
  }, []);

  const ref = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    grid.state.internal.viewport.set(el);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }} ref={ref}>
      <GridProvider grid={grid}>
        <FloatingFrameDriver />
      </GridProvider>
    </div>
  );
}
