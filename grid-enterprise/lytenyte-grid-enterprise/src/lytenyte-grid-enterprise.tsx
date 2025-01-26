import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import {
  CellEditorBottom,
  CellEditorCenter,
  CellEditorTop,
  Viewport,
} from "@1771technologies/lytenyte-grid-community/internal";
import { GridProvider } from "./use-grid";
import { HeaderCellDefault } from "./components/header-cell-default";
import {
  GridFrame,
  FilterMenuDriver,
  ColumnMenuDriver,
  ContextMenuDriver,
  FloatingFrameDriver,
} from "@1771technologies/grid-components";
import { CellSelectionDriver } from "./cell-selection/cell-selection-driver";
import {
  CellSelectionBottom,
  CellSelectionCenter,
  CellSelectionTop,
} from "./cell-selection/cell-selection-containers";

export interface LyteNyteGridEnterpriseProps<D> {
  readonly grid: StoreEnterpriseReact<D>;
}

export function LyteNyteGrid<D>({ grid }: LyteNyteGridEnterpriseProps<D>) {
  return (
    <GridProvider value={grid}>
      <GridFrame grid={grid}>
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
  return (
    <Viewport headerDefault={HeaderCellDefault as any} top={Top} center={Center} bottom={Bottom}>
      <CellSelectionDriver />
    </Viewport>
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
