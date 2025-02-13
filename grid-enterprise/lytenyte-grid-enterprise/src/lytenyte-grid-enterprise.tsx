import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import {
  CellEditorBottom,
  CellEditorCenter,
  CellEditorTop,
  ClassProvider,
  Viewport,
  type CellClasses,
} from "@1771technologies/lytenyte-grid-community/internal";
import { GridProvider, useGrid } from "./use-grid";
import { HeaderCellDefault } from "./components/header-cell/header-cell-default";
import {
  GridFrame,
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
import { useMemo } from "react";
import { Watermark } from "./watermark";
import { OverlayDriver } from "./overlay/overlay-driver";
import { ColumnMenuDriver } from "./components/column-menu-driver";

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
  const { state } = useGrid();
  const cellSelectionEnabled = state.cellSelectionMode.use() !== "none";

  const classes = useMemo<CellClasses>(() => {
    if (!cellSelectionEnabled) return { cellClasses: "" };
    return {
      cellClasses: css`
        &:focus::after {
          border-color: transparent;
        }
      `,
    };
  }, [cellSelectionEnabled]);

  return (
    <ClassProvider value={classes}>
      <OverlayDriver />
      <Viewport headerDefault={HeaderCellDefault as any} top={Top} center={Center} bottom={Bottom}>
        <CellSelectionDriver />
        <Watermark id={state.gridId.use()} />
      </Viewport>
    </ClassProvider>
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
