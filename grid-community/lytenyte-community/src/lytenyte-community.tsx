import type { StoreCommunityReact } from "@1771technologies/grid-types";
import { GridProvider } from "./use-grid";
import { Viewport } from "./renderer/viewport";
import { HeaderCellDefault } from "./header/header-renderers/header-cell-default";
import {
  CellEditorBottom,
  CellEditorCenter,
  CellEditorTop,
} from "./cell-edit/cell-edit-containers";

export interface LyteNyteGridCommunityProps<D> {
  readonly grid: StoreCommunityReact<D>;
}

export function LyteNyteGridCommunity<D>({ grid }: LyteNyteGridCommunityProps<D>) {
  return (
    <GridProvider value={grid}>
      <LyteNyteCommunityImpl />
    </GridProvider>
  );
}

function LyteNyteCommunityImpl() {
  return (
    <Viewport
      headerDefault={HeaderCellDefault}
      top={CellEditorTop}
      center={CellEditorCenter}
      bottom={CellEditorBottom}
    />
  );
}
