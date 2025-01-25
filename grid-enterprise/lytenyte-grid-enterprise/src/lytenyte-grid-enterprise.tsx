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
    <Viewport headerDefault={HeaderCellDefault as any} top={Top} center={Center} bottom={Bottom} />
  );
}

function Center() {
  return (
    <>
      <CellEditorCenter />
    </>
  );
}

function Top() {
  return (
    <>
      <CellEditorTop />
    </>
  );
}
function Bottom() {
  return (
    <>
      <CellEditorBottom />
    </>
  );
}
