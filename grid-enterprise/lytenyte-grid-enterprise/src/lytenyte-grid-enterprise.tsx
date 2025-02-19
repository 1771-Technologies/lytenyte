import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import {
  CellEditorBottom,
  CellEditorCenter,
  CellEditorTop,
  Viewport,
} from "@1771technologies/lytenyte-grid-community/internal";
import { GridProvider, useGrid } from "./use-grid";
import {
  FilterMenuDriver,
  ContextMenuDriver,
  FloatingFrameDriver,
} from "@1771technologies/grid-components";
import { CellSelectionDriver } from "./cell-selection/cell-selection-driver";
import {
  CellSelectionBottom,
  CellSelectionCenter,
  CellSelectionTop,
} from "./cell-selection/cell-selection-containers";
import { Watermark } from "./watermark";
import { OverlayDriver } from "./overlay/overlay-driver";
import { ColumnMenuDriver } from "./components-internal/column-menu-driver";
import { GridFrame } from "./components-internal/grid-frame";
import type { SplitPaneAxe } from "@1771technologies/react-split-pane";

export interface LyteNyteGridEnterpriseProps<D> {
  readonly grid: StoreEnterpriseReact<D>;
  readonly frameAxe?: SplitPaneAxe;
}

export function LyteNyteGrid<D>({ grid, frameAxe }: LyteNyteGridEnterpriseProps<D>) {
  return (
    <GridProvider value={grid}>
      <GridFrame grid={grid} axe={frameAxe}>
        <LyteNyteCommunityImpl />
        <FilterMenuDriver />
        <ColumnMenuDriver />
        <ContextMenuDriver />
        <FloatingFrameDriver />
      </GridFrame>
    </GridProvider>
  );
}

function LyteNyteCommunityImpl() {
  const { state } = useGrid();

  return (
    <>
      <OverlayDriver />
      <Viewport top={Top} center={Center} bottom={Bottom}>
        <CellSelectionDriver />
        <Watermark id={state.gridId.use()} />
      </Viewport>
    </>
  );
}

function Center() {
  return (
    <>
      <CellEditorCenter />
      <CellSelectionCenter />
    </>
  );
}

function Top() {
  return (
    <>
      <CellEditorTop />
      <CellSelectionTop />
    </>
  );
}
function Bottom() {
  return (
    <>
      <CellEditorBottom />
      <CellSelectionBottom />
    </>
  );
}
