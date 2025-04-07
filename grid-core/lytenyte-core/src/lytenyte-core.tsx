import "./lytenyte.css";
import { GridProvider } from "./use-grid";
import { Viewport } from "./viewport/viewport";
import {
  CellEditorBottom,
  CellEditorCenter,
  CellEditorTop,
} from "./cell-edit/cell-edit-containers";
import type { GridCoreReact } from "@1771technologies/grid-types/core-react";

export interface LyteNyteGridCoreProps<D> {
  readonly grid: GridCoreReact<D>;
}

export function LyteNyteGridCore<D>({ grid }: LyteNyteGridCoreProps<D>) {
  return (
    <GridProvider value={grid}>
      <LyteNyteCoreImpl />
    </GridProvider>
  );
}

function LyteNyteCoreImpl() {
  return <Viewport top={CellEditorTop} center={CellEditorCenter} bottom={CellEditorBottom} />;
}
