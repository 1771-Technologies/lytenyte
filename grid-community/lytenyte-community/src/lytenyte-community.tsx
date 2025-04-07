import "./lytenyte.css";
import { GridProvider } from "./use-grid";
import { Viewport } from "./viewport/viewport";
import {
  CellEditorBottom,
  CellEditorCenter,
  CellEditorTop,
} from "./cell-edit/cell-edit-containers";
import type { GridCoreReact } from "@1771technologies/grid-types/core-react";

export interface LyteNyteGridCommunityProps<D> {
  readonly grid: GridCoreReact<D>;
}

export function LyteNyteGridCommunity<D>({ grid }: LyteNyteGridCommunityProps<D>) {
  return (
    <GridProvider value={grid}>
      <LyteNyteCommunityImpl />
    </GridProvider>
  );
}

function LyteNyteCommunityImpl() {
  return <Viewport top={CellEditorTop} center={CellEditorCenter} bottom={CellEditorBottom} />;
}
