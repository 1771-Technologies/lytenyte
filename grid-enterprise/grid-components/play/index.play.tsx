import { makeStore } from "@1771technologies/grid-store-enterprise";
import { bankColumns } from "./helpers";
import { GridProvider } from "../src/provider/grid-provider";
import { t } from "@1771technologies/grid-design";
import { useCallback } from "react";
import { PillManager } from "../src/pill-manager/pill-manager";

const grid = makeStore({
  gridId: "x",
  columns: bankColumns,
  columnBase: {
    sortable: true,
    movable: true,
    measureFuncsAllowed: ["avg"],
  },
  rowGroupModel: ["education", "day"],
  columnPivotModel: ["loan"],
  measureModel: ["poutcome"],
});

export default function Home() {
  const s = useCallback((el: HTMLElement | null) => {
    if (!el) return;
    grid.state.internal.viewport.set(el);
  }, []);

  return (
    <GridProvider grid={grid}>
      <div style={{ width: "100vw", height: "100vh", background: t.colors.gray_00 }} ref={s}>
        <PillManager api={grid.api} />
      </div>
    </GridProvider>
  );
}
