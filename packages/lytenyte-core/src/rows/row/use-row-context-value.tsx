import { useMemo } from "react";
import type { Grid, RowLayout } from "../../+types.js";
import type { InternalAtoms } from "../../state/+types.js";
import type { RowMetaData } from "./context.js";
import { useRowSelectionState } from "./use-row-selection-state.js";

export function useRowContextValue(
  grid: Grid<any> & { internal: InternalAtoms },
  row: RowLayout<any>,
  yPositions: Uint32Array,
) {
  const r = row.row.useValue();

  const xPositions = grid.state.xPositions.useValue();

  const [selected, indeterminate] = useRowSelectionState(grid, r);

  const colBounds = grid.internal.colBounds.useValue();
  const rtl = grid.state.rtl.useValue();
  const base = grid.state.columnBase.useValue();
  const renderers = grid.state.cellRenderers.useValue();

  const value = useMemo<RowMetaData>(() => {
    return {
      selected,
      indeterminate: indeterminate,
      colBounds,
      row: r,
      layout: row,
      xPositions,
      yPositions,
      rtl,
      base,
      renderers,
    };
  }, [base, colBounds, indeterminate, r, renderers, row, rtl, selected, xPositions, yPositions]);

  return value;
}
