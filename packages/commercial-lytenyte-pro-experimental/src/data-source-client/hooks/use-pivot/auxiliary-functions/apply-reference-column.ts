import type { Column, GridSpec } from "../../../../types/index.js";

export function applyReferenceColumn<Spec extends GridSpec>(
  pivotColumn: Column<Spec>,
  reference: Omit<Column<Spec>, "id"> | undefined,
) {
  Object.assign(pivotColumn, {
    headerRenderer: reference?.headerRenderer,
    cellRenderer: reference?.cellRenderer,
    autosizeCellFn: reference?.autosizeCellFn,
    autosizeHeaderFn: reference?.autosizeHeaderFn,
    floatingCellRenderer: reference?.floatingCellRenderer,
    movable: reference?.movable,
    resizable: reference?.resizable,
    type: reference?.type,
    width: reference?.width,
    widthMin: reference?.widthMin,
    widthMax: reference?.widthMax,
    widthFlex: reference?.widthFlex,
  });

  return pivotColumn;
}
