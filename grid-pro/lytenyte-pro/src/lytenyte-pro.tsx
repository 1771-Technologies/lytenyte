import {
  CellEditorBottom,
  CellEditorCenter,
  CellEditorTop,
  Viewport,
} from "@1771technologies/lytenyte-core/internal";
import { GridProvider, useGrid } from "./use-grid";
import { CellSelectionDriver } from "./cell-selection/cell-selection-driver";
import {
  CellSelectionBottom,
  CellSelectionCenter,
  CellSelectionTop,
} from "./cell-selection/cell-selection-containers";
import { Watermark } from "./watermark";
import { OverlayDriver } from "./overlay/overlay-driver";
import { ColumnMenuDriver } from "./menu/column-menu/column-menu-driver";
import { GridFrame } from "./components-internal/grid-frame/grid-frame";
import type { SplitPaneAxe } from "@1771technologies/react-split-pane";
import { ContextMenuDriver } from "./menu/context-menu/context-menu-driver";
import { DialogDriver } from "./dialog/dialog-driver";
import { PopoverDriver } from "./popover/popover-driver";
import type { GridProReact } from "./types";
import { MenuFrameDriver } from "./menu-frame/menu-frame-driver";

export interface LyteNyteGridProProps<D> {
  readonly grid: GridProReact<D>;
  readonly frameAxe?: SplitPaneAxe;
}

export function LyteNyteGrid<D>({ grid, frameAxe }: LyteNyteGridProProps<D>) {
  return (
    <GridProvider value={grid}>
      <GridFrame grid={grid} axe={frameAxe}>
        <LyteNyteProImpl />
        <ColumnMenuDriver />
        <ContextMenuDriver />
        <DialogDriver />
        <PopoverDriver />
        <MenuFrameDriver />
      </GridFrame>
    </GridProvider>
  );
}

function LyteNyteProImpl() {
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
